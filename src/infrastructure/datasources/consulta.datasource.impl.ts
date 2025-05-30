// infrastructure/datasources/consulta.datasource.impl.ts
import { ConsultaModel, PacienteModel, MedicoModel, UnidadeModel } from "../../data/mongodb";
import { CustomError } from "../../domain";
import { BuscarConsultaResult, ConsultaDatasource, EstatisticasConsulta } from "../../domain/datasources/consulta.datasource";
import { BuscarConsultaDto } from "../../domain/dtos/consulta/buscar-consulta.dto";
import { CriarConsultaDto } from "../../domain/dtos/consulta/criar-consulta.dto";
import { FinalizarConsultaDto } from "../../domain/dtos/consulta/finalizar-consulta.dto";
import { IniciarAtendimentoDto } from "../../domain/dtos/consulta/iniciar-atendimento.dto";
import { ConsultaEntity } from "../../domain/entities/consulta.entity";
import { ConsultaMapper } from "../mappers/consulta.mapper";

export class ConsultaDatasourceImpl implements ConsultaDatasource {
    buscarPorMedico(medicoId: string, data: Date, tenantId: string): Promise<ConsultaEntity[]> {
        throw new Error("Method not implemented.");
    }
    buscarAgendaUnidade(unidadeId: string, data: Date, tenantId: string): Promise<ConsultaEntity[]> {
        throw new Error("Method not implemented.");
    }

    async criar(criarConsultaDto: CriarConsultaDto, tenantId: string, userId: string): Promise<ConsultaEntity> {
        try {
            const consulta = await ConsultaModel.create({
                tenant_id: tenantId,
                ...criarConsultaDto,
                status: 'AGENDADA',
                created_by: userId,
                updated_by: userId
            });

            const consultaPopulada = await this.popularConsulta(consulta._id, tenantId);
            return ConsultaMapper.consultaEntityFromObject(consultaPopulada);
        } catch (error: any) {
            throw CustomError.internalServerError('Erro ao criar consulta');
        }
    }

    async buscarPorId(id: string, tenantId: string): Promise<ConsultaEntity | null> {
        try {
            const consulta = await this.popularConsulta(id, tenantId);
            if (!consulta) return null;
            
            return ConsultaMapper.consultaEntityFromObject(consulta);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar consulta');
        }
    }

    async buscar(buscarConsultaDto: BuscarConsultaDto, tenantId: string): Promise<BuscarConsultaResult> {
        try {
            const { 
                page, limit, paciente_id, medico_id, unidade_id, 
                data_inicio, data_fim, tipo_consulta, status, especialidade 
            } = buscarConsultaDto;
            
            const query: any = { tenant_id: tenantId };

            if (paciente_id) query.paciente_id = paciente_id;
            if (medico_id) query.medico_id = medico_id;
            if (unidade_id) query.unidade_id = unidade_id;
            if (tipo_consulta) query.tipo_consulta = tipo_consulta;
            if (status) query.status = status;
            if (especialidade) query.especialidade = { $regex: especialidade, $options: 'i' };

            if (data_inicio || data_fim) {
                query.data_hora_agendada = {};
                if (data_inicio) query.data_hora_agendada.$gte = data_inicio;
                if (data_fim) query.data_hora_agendada.$lte = data_fim;
            }

            const [consultas, total] = await Promise.all([
                ConsultaModel.find(query)
                    .populate({
                        path: 'paciente_id',
                        populate: { path: 'pessoa_id', select: 'nome cpf data_nascimento' }
                    })
                    .populate({
                        path: 'medico_id',
                        populate: { path: 'pessoa_id', select: 'nome' }
                    })
                    .populate('unidade_id', 'nome tipo')
                    .sort({ data_hora_agendada: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit),
                ConsultaModel.countDocuments(query)
            ]);

            const data = consultas.map(consulta => ConsultaMapper.consultaEntityFromObject(consulta));

            return {
                data,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar consultas');
        }
    }

    async buscarPorPaciente(pacienteId: string, tenantId: string, limit: number = 10): Promise<ConsultaEntity[]> {
        try {
            const consultas = await ConsultaModel.find({
                tenant_id: tenantId,
                paciente_id: pacienteId
            })
            .populate({
                path: 'medico_id',
                populate: { path: 'pessoa_id', select: 'nome' }
            })
            .populate('unidade_id', 'nome tipo')
            .sort({ data_hora_agendada: -1 })
            .limit(limit);

            return consultas.map(consulta => ConsultaMapper.consultaEntityFromObject(consulta));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar agenda da unidade');
        }
    }

    async iniciarAtendimento(id: string, iniciarAtendimentoDto: IniciarAtendimentoDto, tenantId: string, userId: string): Promise<ConsultaEntity> {
        try {
            // Calcular IMC se peso e altura fornecidos
            let sinaisVitais = iniciarAtendimentoDto.sinais_vitais;
            if (sinaisVitais?.peso && sinaisVitais?.altura) {
                const alturaMetros = sinaisVitais.altura / 100;
                sinaisVitais.imc = parseFloat((sinaisVitais.peso / (alturaMetros * alturaMetros)).toFixed(2));
            }

            const consulta = await ConsultaModel.findOneAndUpdate(
                { _id: id, tenant_id: tenantId },
                {
                    status: 'EM_ANDAMENTO',
                    data_hora_inicio: new Date(),
                    sintomas: iniciarAtendimentoDto.sintomas,
                    sinais_vitais: sinaisVitais,
                    triagem: iniciarAtendimentoDto.triagem,
                    observacoes: iniciarAtendimentoDto.observacoes_iniciais,
                    updated_by: userId,
                    updated_at: new Date()
                },
                { new: true }
            );

            if (!consulta) {
                throw CustomError.notfound('Consulta não encontrada');
            }

            const consultaPopulada = await this.popularConsulta(consulta._id, tenantId);
            return ConsultaMapper.consultaEntityFromObject(consultaPopulada);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao iniciar atendimento');
        }
    }

    async finalizarConsulta(id: string, finalizarConsultaDto: FinalizarConsultaDto, tenantId: string, userId: string): Promise<ConsultaEntity> {
        try {
            const consulta = await ConsultaModel.findOneAndUpdate(
                { _id: id, tenant_id: tenantId },
                {
                    status: 'FINALIZADA',
                    data_hora_fim: new Date(),
                    diagnostico: finalizarConsultaDto.diagnostico,
                    receituario: finalizarConsultaDto.receituario,
                    exames_solicitados: finalizarConsultaDto.exames_solicitados,
                    observacoes: finalizarConsultaDto.observacoes,
                    updated_by: userId,
                    updated_at: new Date()
                },
                { new: true }
            );

            if (!consulta) {
                throw CustomError.notfound('Consulta não encontrada');
            }

            const consultaPopulada = await this.popularConsulta(consulta._id, tenantId);
            return ConsultaMapper.consultaEntityFromObject(consultaPopulada);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao finalizar consulta');
        }
    }

    async cancelarConsulta(id: string, motivo: string, tenantId: string, userId: string): Promise<boolean> {
        try {
            const result = await ConsultaModel.updateOne(
                { _id: id, tenant_id: tenantId },
                {
                    status: 'CANCELADA',
                    observacoes: motivo,
                    updated_by: userId,
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao cancelar consulta');
        }
    }

    async marcarNaoCompareceu(id: string, tenantId: string, userId: string): Promise<boolean> {
        try {
            const result = await ConsultaModel.updateOne(
                { _id: id, tenant_id: tenantId },
                {
                    status: 'NAO_COMPARECEU',
                    updated_by: userId,
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao marcar não comparecimento');
        }
    }

    async obterEstatisticas(unidadeId: string, dataInicio: Date, dataFim: Date, tenantId: string): Promise<EstatisticasConsulta> {
        try {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const fimHoje = new Date();
            fimHoje.setHours(23, 59, 59, 999);

            const inicioMes = new Date();
            inicioMes.setDate(1);
            inicioMes.setHours(0, 0, 0, 0);

            const query: any = { tenant_id: tenantId };
            if (unidadeId) query.unidade_id = unidadeId;

            const [totalDia, totalMes, porStatus, tempoMedio] = await Promise.all([
                ConsultaModel.countDocuments({
                    ...query,
                    data_hora_agendada: { $gte: hoje, $lte: fimHoje }
                }),
                ConsultaModel.countDocuments({
                    ...query,
                    data_hora_agendada: { $gte: inicioMes }
                }),
                ConsultaModel.aggregate([
                    { $match: { ...query, data_hora_agendada: { $gte: dataInicio, $lte: dataFim } } },
                    { $group: { _id: '$status', count: { $sum: 1 } } }
                ]),
                ConsultaModel.aggregate([
                    { 
                        $match: { 
                            ...query, 
                            status: 'FINALIZADA',
                            data_hora_inicio: { $exists: true },
                            data_hora_fim: { $exists: true }
                        } 
                    },
                    {
                        $project: {
                            duracao: {
                                $divide: [
                                    { $subtract: ['$data_hora_fim', '$data_hora_inicio'] },
                                    60000 // Converter para minutos
                                ]
                            }
                        }
                    },
                    { $group: { _id: null, tempoMedio: { $avg: '$duracao' } } }
                ])
            ]);

            const porStatusObj: { [key: string]: number } = {};
            porStatus.forEach((item: any) => {
                porStatusObj[item._id] = item.count;
            });

            const totalConsultas = Object.values(porStatusObj).reduce((sum, count) => sum + count, 0);
            const naoCompareceu = porStatusObj['NAO_COMPARECEU'] || 0;
            const taxaNaoComparecimento = totalConsultas > 0 ? (naoCompareceu / totalConsultas) * 100 : 0;

            return {
                total_dia: totalDia,
                total_mes: totalMes,
                por_status: porStatusObj,
                tempo_medio_atendimento: tempoMedio[0]?.tempoMedio || 0,
                taxa_nao_comparecimento: parseFloat(taxaNaoComparecimento.toFixed(2))
            };
        } catch (error) {
            throw CustomError.internalServerError('Erro ao obter estatísticas');
        }
    }

    async verificarDisponibilidade(medicoId: string, dataHora: Date, duracao: number, tenantId: string): Promise<boolean> {
        try {
            const inicioConsulta = dataHora;
            const fimConsulta = new Date(dataHora.getTime() + duracao * 60 * 1000);

            const conflito = await ConsultaModel.findOne({
                tenant_id: tenantId,
                medico_id: medicoId,
                status: { $in: ['AGENDADA', 'CONFIRMADA', 'EM_ANDAMENTO'] },
                $or: [
                    {
                        data_hora_agendada: {
                            $gte: inicioConsulta,
                            $lt: fimConsulta
                        }
                    },
                    {
                        $and: [
                            { data_hora_agendada: { $lte: inicioConsulta } },
                            {
                                $expr: {
                                    $gt: [
                                        { $add: ['$data_hora_agendada', { $multiply: [30, 60000] }] }, // Duração padrão 30 min
                                        inicioConsulta
                                    ]
                                }
                            }
                        ]
                    }
                ]
            });

            return !conflito;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao verificar disponibilidade');
        }
    }

    private async popularConsulta(consultaId: string, tenantId: string): Promise<any> {
        return await ConsultaModel.findOne({ _id: consultaId, tenant_id: tenantId })
            .populate({
                path: 'paciente_id',
                populate: { path: 'pessoa_id', select: 'nome cpf data_nascimento' },
                select: 'numero_cartao_sus tipo_sanguineo'
            })
            .populate({
                path: 'medico_id',
                populate: { path: 'pessoa_id', select: 'nome' },
                select: 'crm especialidade'
            })
            .populate('unidade_id', 'nome tipo');
    }
}