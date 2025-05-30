// infrastructure/datasources/medico.datasource.impl.ts
import { MedicoModel, PessoaModel, AgendamentoModel } from "../../data/mongodb";
import { CustomError } from "../../domain";
import { BuscarMedicoResult, AgendaHorario, MedicoDatasource } from "../../domain/datasources/medico.datasource";
import { AtualizarMedicoDto } from "../../domain/dtos/medico/atualizar-medico.dto";
import { BuscarMedicoDto } from "../../domain/dtos/medico/buscar-medico.dto";
import { CriarMedicoCompletoDto } from "../../domain/dtos/medico/criar-medico-completo.dto";
import { CriarMedicoDto } from "../../domain/dtos/medico/criar-medico.dto";
import { MedicoEntity } from "../../domain/entities/medico.entity";
import { PessoaRepository } from "../../domain/repositories/pessoa.repository";
import { MedicoMapper } from "../mappers/medico.mapper";

export class MedicoDatasourceImpl implements MedicoDatasource {
    constructor(private readonly pessoaRepository: PessoaRepository) {}

    async criar(criarMedicoDto: CriarMedicoDto, tenantId: string, userId: string): Promise<MedicoEntity> {
        try {
            const medico = await MedicoModel.create({
                tenant_id: tenantId,
                ...criarMedicoDto,
                created_by: userId,
                updated_by: userId
            });

            const medicoPopulado = await MedicoModel.findById(medico._id).populate('pessoa_id');
            return MedicoMapper.medicoEntityFromObject(medicoPopulado!);
        } catch (error: any) {
            if (error.code === 11000) {
                if (error.keyPattern.crm) {
                    throw CustomError.badRequest('CRM já cadastrado neste município');
                }
            }
            throw CustomError.internalServerError('Erro ao criar médico');
        }
    }

    async criarCompleto(criarMedicoCompletoDto: CriarMedicoCompletoDto, tenantId: string, userId: string): Promise<MedicoEntity> {
        try {
            // Criar pessoa primeiro
            const pessoa = await this.pessoaRepository.criar(criarMedicoCompletoDto.dadosPessoa, tenantId, userId);

            // Criar médico
            const medico = await MedicoModel.create({
                tenant_id: tenantId,
                pessoa_id: pessoa.id,
                ...criarMedicoCompletoDto.dadosMedico,
                created_by: userId,
                updated_by: userId
            });

            const medicoPopulado = await MedicoModel.findById(medico._id).populate('pessoa_id');
            return MedicoMapper.medicoEntityFromObject(medicoPopulado!);
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            if (error.code === 11000) {
                if (error.keyPattern.crm) {
                    throw CustomError.badRequest('CRM já cadastrado neste município');
                }
            }
            throw CustomError.internalServerError('Erro ao criar médico completo');
        }
    }

    async buscarPorId(id: string, tenantId: string): Promise<MedicoEntity | null> {
        try {
            const medico = await MedicoModel.findOne({ _id: id, tenant_id: tenantId })
                .populate('pessoa_id')
                .populate('unidades_vinculadas', 'nome tipo');
            
            if (!medico) return null;
            return MedicoMapper.medicoEntityFromObject(medico);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar médico');
        }
    }

    async buscarPorPessoa(pessoaId: string, tenantId: string): Promise<MedicoEntity | null> {
        try {
            const medico = await MedicoModel.findOne({ pessoa_id: pessoaId, tenant_id: tenantId })
                .populate('pessoa_id');
            
            if (!medico) return null;
            return MedicoMapper.medicoEntityFromObject(medico);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar médico por pessoa');
        }
    }

    async buscarPorCrm(crm: string, tenantId: string): Promise<MedicoEntity | null> {
        try {
            const medico = await MedicoModel.findOne({ crm, tenant_id: tenantId })
                .populate('pessoa_id');
            
            if (!medico) return null;
            return MedicoMapper.medicoEntityFromObject(medico);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar médico por CRM');
        }
    }

    async buscar(buscarMedicoDto: BuscarMedicoDto, tenantId: string): Promise<BuscarMedicoResult> {
        try {
            const { page, limit, search, especialidade, conselho_estado, unidade_id, aceita_convenio, disponivel_hoje } = buscarMedicoDto;
            
            const query: any = { tenant_id: tenantId };

            // Pipeline de agregação
            const pipeline: any[] = [
                { $match: query },
                {
                    $lookup: {
                        from: 'pessoas',
                        localField: 'pessoa_id',
                        foreignField: '_id',
                        as: 'pessoa'
                    }
                },
                { $unwind: '$pessoa' }
            ];

            // Filtros adicionais
            const matchStage: any = {};

            if (search) {
                matchStage.$or = [
                    { 'pessoa.nome': { $regex: search, $options: 'i' } },
                    { 'crm': { $regex: search, $options: 'i' } },
                    { 'especialidade': { $regex: search, $options: 'i' } }
                ];
            }

            if (especialidade) matchStage.especialidade = { $regex: especialidade, $options: 'i' };
            if (conselho_estado) matchStage.conselho_estado = conselho_estado;
            if (unidade_id) matchStage.unidades_vinculadas = unidade_id;
            if (aceita_convenio !== undefined) matchStage.aceita_convenio = aceita_convenio;

            if (disponivel_hoje) {
                const hoje = new Date().getDay();
                matchStage['horarios_atendimento.dia_semana'] = hoje;
            }

            if (Object.keys(matchStage).length > 0) {
                pipeline.push({ $match: matchStage });
            }

            // Paginação
            const [medicos, totalResult] = await Promise.all([
                MedicoModel.aggregate([
                    ...pipeline,
                    { $sort: { 'pessoa.nome': 1 } },
                    { $skip: (page - 1) * limit },
                    { $limit: limit }
                ]),
                MedicoModel.aggregate([
                    ...pipeline,
                    { $count: "total" }
                ])
            ]);

            const total = totalResult[0]?.total || 0;
            const data = medicos.map(medico => MedicoMapper.medicoEntityFromObject(medico));

            return {
                data,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar médicos');
        }
    }

    async buscarPorUnidade(unidadeId: string, tenantId: string): Promise<MedicoEntity[]> {
        try {
            const medicos = await MedicoModel.find({ 
                tenant_id: tenantId,
                unidades_vinculadas: unidadeId
            }).populate('pessoa_id');

            return medicos.map(medico => MedicoMapper.medicoEntityFromObject(medico));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar médicos por unidade');
        }
    }

    async buscarPorEspecialidade(especialidade: string, tenantId: string): Promise<MedicoEntity[]> {
        try {
            const medicos = await MedicoModel.find({ 
                tenant_id: tenantId,
                especialidade: { $regex: especialidade, $options: 'i' }
            }).populate('pessoa_id');

            return medicos.map(medico => MedicoMapper.medicoEntityFromObject(medico));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar médicos por especialidade');
        }
    }

    async obterAgenda(medicoId: string, data: Date, tenantId: string): Promise<AgendaHorario[]> {
        try {
            const medico = await MedicoModel.findOne({ _id: medicoId, tenant_id: tenantId });
            if (!medico) {
                throw CustomError.notfound('Médico não encontrado');
            }

            const diaSemana = data.getDay();
            const horariosDisponiveis = medico.horarios_atendimento?.filter(h => h.dia_semana === diaSemana) || [];

            // Buscar agendamentos do dia
            const inicioData = new Date(data);
            inicioData.setHours(0, 0, 0, 0);
            const fimData = new Date(data);
            fimData.setHours(23, 59, 59, 999);

            const agendamentos = await AgendamentoModel.countDocuments({
                tenant_id: tenantId,
                medico_id: medicoId,
                data_hora: { $gte: inicioData, $lte: fimData },
                status: { $in: ['AGENDADO', 'CONFIRMADO'] }
            });

            return horariosDisponiveis.map(horario => ({
                dia_semana: horario.dia_semana!,
                hora_inicio: horario.hora_inicio!,
                hora_fim: horario.hora_fim!,
                disponivel: true, // Lógica mais complexa pode ser implementada
                consultas_agendadas: agendamentos
            }));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao obter agenda do médico');
        }
    }

    async atualizar(id: string, atualizarMedicoDto: AtualizarMedicoDto, tenantId: string, userId: string): Promise<MedicoEntity> {
        try {
            const medico = await MedicoModel.findOneAndUpdate(
                { _id: id, tenant_id: tenantId },
                { 
                    ...atualizarMedicoDto,
                    updated_by: userId,
                    updated_at: new Date()
                },
                { new: true }
            ).populate('pessoa_id').populate('unidades_vinculadas', 'nome tipo');

            if (!medico) {
                throw CustomError.notfound('Médico não encontrado');
            }

            return MedicoMapper.medicoEntityFromObject(medico);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao atualizar médico');
        }
    }

    async deletar(id: string, tenantId: string): Promise<boolean> {
        try {
            const result = await MedicoModel.deleteOne({ _id: id, tenant_id: tenantId });
            return result.deletedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao deletar médico');
        }
    }
}