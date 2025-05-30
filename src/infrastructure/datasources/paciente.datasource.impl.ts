// infrastructure/datasources/paciente.datasource.impl.ts
import { PacienteModel, PessoaModel } from "../../data/mongodb";
import { CustomError } from "../../domain";
import { BuscarPacienteResult, PacienteDatasource } from "../../domain/datasources/paciente.datasource";
import { AtualizarPacienteDto } from "../../domain/dtos/paciente/atualizar-paciente.dto";
import { BuscarPacienteDto } from "../../domain/dtos/paciente/buscar-paciente.dto";
import { CriarPacienteCompletoDto } from "../../domain/dtos/paciente/criar-paciente-completo.dto";
import { CriarPacienteDto } from "../../domain/dtos/paciente/criar-paciente.dto";
import { PacienteEntity } from "../../domain/entities/paciente.entity";
import { PessoaRepository } from "../../domain/repositories/pessoa.repository";
import { PacienteMapper } from "../mappers/paciente.mapper";

export class PacienteDatasourceImpl implements PacienteDatasource {
    constructor(private readonly pessoaRepository: PessoaRepository) {}

    async criar(criarPacienteDto: CriarPacienteDto, tenantId: string, userId: string): Promise<PacienteEntity> {
        try {
            const paciente = await PacienteModel.create({
                tenant_id: tenantId,
                ...criarPacienteDto,
                created_by: userId,
                updated_by: userId
            });

            const pacientePopulado = await PacienteModel.findById(paciente._id).populate('pessoa_id');
            return PacienteMapper.pacienteEntityFromObject(pacientePopulado!);
        } catch (error: any) {
            if (error.code === 11000) {
                if (error.keyPattern.numero_cartao_sus) {
                    throw CustomError.badRequest('Cartão SUS já cadastrado neste município');
                }
            }
            throw CustomError.internalServerError('Erro ao criar paciente');
        }
    }

    async criarCompleto(criarPacienteCompletoDto: CriarPacienteCompletoDto, tenantId: string, userId: string): Promise<PacienteEntity> {
        try {
            // Criar pessoa primeiro
            const pessoa = await this.pessoaRepository.criar(criarPacienteCompletoDto.dadosPessoa, tenantId, userId);

            // Criar paciente
            const paciente = await PacienteModel.create({
                tenant_id: tenantId,
                pessoa_id: pessoa.id,
                ...criarPacienteCompletoDto.dadosPaciente,
                created_by: userId,
                updated_by: userId
            });

            const pacientePopulado = await PacienteModel.findById(paciente._id).populate('pessoa_id');
            return PacienteMapper.pacienteEntityFromObject(pacientePopulado!);
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            if (error.code === 11000) {
                if (error.keyPattern.numero_cartao_sus) {
                    throw CustomError.badRequest('Cartão SUS já cadastrado neste município');
                }
            }
            throw CustomError.internalServerError('Erro ao criar paciente completo');
        }
    }

    async buscarPorId(id: string, tenantId: string): Promise<PacienteEntity | null> {
        try {
            const paciente = await PacienteModel.findOne({ _id: id, tenant_id: tenantId })
                .populate('pessoa_id');
            
            if (!paciente) return null;
            return PacienteMapper.pacienteEntityFromObject(paciente);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar paciente');
        }
    }

    async buscarPorPessoa(pessoaId: string, tenantId: string): Promise<PacienteEntity | null> {
        try {
            const paciente = await PacienteModel.findOne({ pessoa_id: pessoaId, tenant_id: tenantId })
                .populate('pessoa_id');
            
            if (!paciente) return null;
            return PacienteMapper.pacienteEntityFromObject(paciente);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar paciente por pessoa');
        }
    }

    async buscarPorCartaoSus(cartaoSus: string, tenantId: string): Promise<PacienteEntity | null> {
        try {
            const paciente = await PacienteModel.findOne({ 
                numero_cartao_sus: cartaoSus, 
                tenant_id: tenantId 
            }).populate('pessoa_id');
            
            if (!paciente) return null;
            return PacienteMapper.pacienteEntityFromObject(paciente);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar paciente por cartão SUS');
        }
    }

    async buscar(buscarPacienteDto: BuscarPacienteDto, tenantId: string): Promise<BuscarPacienteResult> {
        try {
            const { page, limit, search, tipo_sanguineo, tem_alergias, cidade, estado } = buscarPacienteDto;
            
            const query: any = { tenant_id: tenantId };

            // Pipeline de agregação para buscar com dados da pessoa
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
                const cpfLimpo = search.replace(/\D/g, '');
                matchStage.$or = [
                    { 'pessoa.nome': { $regex: search, $options: 'i' } },
                    { 'pessoa.cpf': { $regex: cpfLimpo } },
                    { 'numero_cartao_sus': { $regex: cpfLimpo } }
                ];
            }

            if (tipo_sanguineo) matchStage.tipo_sanguineo = tipo_sanguineo;
            //if (tem_alergias) matchStage.alergias = { $exists: true, $ne: null, $ne: '' };
            if (cidade) matchStage['pessoa.endereco.cidade'] = { $regex: cidade, $options: 'i' };
            if (estado) matchStage['pessoa.endereco.estado'] = { $regex: estado, $options: 'i' };

            if (Object.keys(matchStage).length > 0) {
                pipeline.push({ $match: matchStage });
            }

            // Paginação
            const [pacientes, totalResult] = await Promise.all([
                PacienteModel.aggregate([
                    ...pipeline,
                    { $sort: { created_at: -1 } },
                    { $skip: (page - 1) * limit },
                    { $limit: limit }
                ]),
                PacienteModel.aggregate([
                    ...pipeline,
                    { $count: "total" }
                ])
            ]);

            const total = totalResult[0]?.total || 0;
            const data = pacientes.map(paciente => PacienteMapper.pacienteEntityFromObject(paciente));

            return {
                data,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar pacientes');
        }
    }

    async atualizar(id: string, atualizarPacienteDto: AtualizarPacienteDto, tenantId: string, userId: string): Promise<PacienteEntity> {
        try {
            const paciente = await PacienteModel.findOneAndUpdate(
                { _id: id, tenant_id: tenantId },
                { 
                    ...atualizarPacienteDto,
                    updated_by: userId,
                    updated_at: new Date()
                },
                { new: true }
            ).populate('pessoa_id');

            if (!paciente) {
                throw CustomError.notfound('Paciente não encontrado');
            }

            return PacienteMapper.pacienteEntityFromObject(paciente);
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            if (error.code === 11000 && error.keyPattern.numero_cartao_sus) {
                throw CustomError.badRequest('Cartão SUS já cadastrado para outro paciente');
            }
            throw CustomError.internalServerError('Erro ao atualizar paciente');
        }
    }

    async deletar(id: string, tenantId: string): Promise<boolean> {
        try {
            const result = await PacienteModel.deleteOne({ _id: id, tenant_id: tenantId });
            return result.deletedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao deletar paciente');
        }
    }
}