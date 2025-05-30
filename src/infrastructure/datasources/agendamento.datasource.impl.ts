// infrastructure/datasources/agendamento.datasource.impl.ts
import { AgendamentoModel, PacienteModel, MedicoModel, UnidadeModel } from "../../data/mongodb";
import { CustomError } from "../../domain";
import { BuscarAgendamentoResult, DisponibilidadeHorario, AgendaDia, AgendamentoDatasource } from "../../domain/datasources/agendamento.datasource";
import { AtualizarAgendamentoDto } from "../../domain/dtos/agendamento/atualizar-agendamento.dto";
import { BuscarAgendamentoDto } from "../../domain/dtos/agendamento/buscar-agendamento.dto";
import { CancelarAgendamentoDto } from "../../domain/dtos/agendamento/cancelar-agendamento.dto";
import { CriarAgendamentoDto } from "../../domain/dtos/agendamento/criar-agendamento.dto";
import { AgendamentoEntity } from "../../domain/entities/agendamento.entity";
import { AgendamentoMapper } from "../mappers/agendamento.mapper";

export class AgendamentoDatasourceImpl implements AgendamentoDatasource {

    async criar(criarAgendamentoDto: CriarAgendamentoDto, tenantId: string, userId: string): Promise<AgendamentoEntity> {
        try {
            const agendamento = await AgendamentoModel.create({
                tenant_id: tenantId,
                ...criarAgendamentoDto,
                agendado_por: userId,
                created_by: userId,
                updated_by: userId
            });

            const agendamentoPopulado = await this.popularAgendamento(agendamento._id, tenantId);
            return AgendamentoMapper.agendamentoEntityFromObject(agendamentoPopulado);
        } catch (error: any) {
            throw CustomError.internalServerError('Erro ao criar agendamento');
        }
    }

    async buscarPorId(id: string, tenantId: string): Promise<AgendamentoEntity | null> {
        try {
            const agendamento = await this.popularAgendamento(id, tenantId);
            if (!agendamento) return null;
            
            return AgendamentoMapper.agendamentoEntityFromObject(agendamento);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar agendamento');
        }
    }

    async buscar(buscarAgendamentoDto: BuscarAgendamentoDto, tenantId: string): Promise<BuscarAgendamentoResult> {
        try {
            const { 
                page, limit, paciente_id, medico_id, unidade_id,
                data_inicio, data_fim, tipo_agendamento, status, prioridade 
            } = buscarAgendamentoDto;
            
            const query: any = { tenant_id: tenantId };

            if (paciente_id) query.paciente_id = paciente_id;
            if (medico_id) query.medico_id = medico_id;
            if (unidade_id) query.unidade_id = unidade_id;
            if (tipo_agendamento) query.tipo_agendamento = tipo_agendamento;
            if (status) query.status = status;
            if (prioridade) query.prioridade = prioridade;

            if (data_inicio || data_fim) {
                query.data_hora = {};
                if (data_inicio) query.data_hora.$gte = data_inicio;
                if (data_fim) query.data_hora.$lte = data_fim;
            }

            const [agendamentos, total] = await Promise.all([
                AgendamentoModel.find(query)
                    .populate({
                        path: 'paciente_id',
                        populate: { path: 'pessoa_id', select: 'nome cpf telefone' }
                    })
                    .populate({
                        path: 'medico_id',
                        populate: { path: 'pessoa_id', select: 'nome' }
                    })
                    .populate('unidade_id', 'nome tipo')
                    .sort({ data_hora: 1 })
                    .skip((page - 1) * limit)
                    .limit(limit),
                AgendamentoModel.countDocuments(query)
            ]);

            const data = agendamentos.map(agendamento => AgendamentoMapper.agendamentoEntityFromObject(agendamento));

            return {
                data,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar agendamentos');
        }
    }

    async buscarPorPaciente(pacienteId: string, tenantId: string): Promise<AgendamentoEntity[]> {
        try {
            const agendamentos = await AgendamentoModel.find({
                tenant_id: tenantId,
                paciente_id: pacienteId
            })
            .populate({
                path: 'medico_id',
                populate: { path: 'pessoa_id', select: 'nome' }
            })
            .populate('unidade_id', 'nome tipo')
            .sort({ data_hora: -1 })
            .limit(10);

            return agendamentos.map(agendamento => AgendamentoMapper.agendamentoEntityFromObject(agendamento));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar agendamentos do paciente');
        }
    }

    async buscarPorMedico(medicoId: string, data: Date, tenantId: string): Promise<AgendamentoEntity[]> {
        try {
            const inicioData = new Date(data);
            inicioData.setHours(0, 0, 0, 0);
            const fimData = new Date(data);
            fimData.setHours(23, 59, 59, 999);

            const agendamentos = await AgendamentoModel.find({
                tenant_id: tenantId,
                medico_id: medicoId,
                data_hora: { $gte: inicioData, $lte: fimData }
            })
            .populate({
                path: 'paciente_id',
                populate: { path: 'pessoa_id', select: 'nome cpf telefone' }
            })
            .populate('unidade_id', 'nome')
            .sort({ data_hora: 1 });

            return agendamentos.map(agendamento => AgendamentoMapper.agendamentoEntityFromObject(agendamento));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar agendamentos do médico');
        }
    }

    async buscarAgendaDia(medicoId: string, data: Date, tenantId: string): Promise<AgendaDia> {
        try {
            const inicioData = new Date(data);
            inicioData.setHours(0, 0, 0, 0);
            const fimData = new Date(data);
            fimData.setHours(23, 59, 59, 999);

            const agendamentos = await AgendamentoModel.find({
                tenant_id: tenantId,
                medico_id: medicoId,
                data_hora: { $gte: inicioData, $lte: fimData },
                status: { $in: ['AGENDADO', 'CONFIRMADO'] }
            }).sort({ data_hora: 1 });

            // Gerar horários disponíveis (8h às 18h, intervalos de 30min)
            const horarios: DisponibilidadeHorario[] = [];
            for (let hora = 8; hora < 18; hora++) {
                for (let minuto = 0; minuto < 60; minuto += 30) {
                    const dataHora = new Date(data);
                    dataHora.setHours(hora, minuto, 0, 0);
                    
                    const ocupado = agendamentos.some(ag => 
                        Math.abs(ag.data_hora.getTime() - dataHora.getTime()) < 30 * 60 * 1000
                    );

                    horarios.push({
                        data_hora: dataHora,
                        disponivel: !ocupado,
                        medico_id: medicoId
                    });
                }
            }

            return {
                data,
                horarios,
                total_agendamentos: agendamentos.length,
                vagas_disponiveis: horarios.filter(h => h.disponivel).length
            };
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar agenda do dia');
        }
    }

    async verificarDisponibilidade(medicoId: string, dataHora: Date, duracao: number, tenantId: string, excluirId?: string): Promise<boolean> {
        try {
            const inicioConsulta = dataHora;
            const fimConsulta = new Date(dataHora.getTime() + duracao * 60 * 1000);

            const query: any = {
                tenant_id: tenantId,
                medico_id: medicoId,
                status: { $in: ['AGENDADO', 'CONFIRMADO'] },
                data_hora: {
                    $gte: new Date(inicioConsulta.getTime() - 30 * 60 * 1000), // 30min antes
                    $lte: new Date(fimConsulta.getTime() + 30 * 60 * 1000)     // 30min depois
                }
            };

            if (excluirId) {
                query._id = { $ne: excluirId };
            }

            const conflito = await AgendamentoModel.findOne(query);
            return !conflito;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao verificar disponibilidade');
        }
    }

    async obterHorariosDisponiveis(medicoId: string, data: Date, tenantId: string): Promise<DisponibilidadeHorario[]> {
        try {
            const agenda = await this.buscarAgendaDia(medicoId, data, tenantId);
            return agenda.horarios.filter(h => h.disponivel);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao obter horários disponíveis');
        }
    }

    async atualizar(id: string, atualizarAgendamentoDto: AtualizarAgendamentoDto, tenantId: string, userId: string): Promise<AgendamentoEntity> {
        try {
            const agendamento = await AgendamentoModel.findOneAndUpdate(
                { _id: id, tenant_id: tenantId },
                { 
                    ...atualizarAgendamentoDto,
                    updated_by: userId,
                    updated_at: new Date()
                },
                { new: true }
            );

            if (!agendamento) {
                throw CustomError.notfound('Agendamento não encontrado');
            }

            const agendamentoPopulado = await this.popularAgendamento(agendamento._id, tenantId);
            return AgendamentoMapper.agendamentoEntityFromObject(agendamentoPopulado);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao atualizar agendamento');
        }
    }

    async confirmar(id: string, tenantId: string, userId: string): Promise<boolean> {
        try {
            const result = await AgendamentoModel.updateOne(
                { _id: id, tenant_id: tenantId },
                {
                    status: 'CONFIRMADO',
                    confirmado_em: new Date(),
                    updated_by: userId,
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao confirmar agendamento');
        }
    }

    async cancelar(id: string, cancelarAgendamentoDto: CancelarAgendamentoDto, tenantId: string, userId: string): Promise<boolean> {
        try {
            const result = await AgendamentoModel.updateOne(
                { _id: id, tenant_id: tenantId },
                {
                    status: 'CANCELADO',
                    cancelado_em: new Date(),
                    motivo_cancelamento: cancelarAgendamentoDto.motivo_cancelamento,
                    updated_by: userId,
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao cancelar agendamento');
        }
    }

    async reagendar(id: string, novaDataHora: Date, tenantId: string, userId: string): Promise<AgendamentoEntity> {
        try {
            const agendamento = await AgendamentoModel.findOneAndUpdate(
                { _id: id, tenant_id: tenantId },
                {
                    data_hora: novaDataHora,
                    status: 'REAGENDADO',
                    updated_by: userId,
                    updated_at: new Date()
                },
                { new: true }
            );

            if (!agendamento) {
                throw CustomError.notfound('Agendamento não encontrado');
            }

            const agendamentoPopulado = await this.popularAgendamento(agendamento._id, tenantId);
            return AgendamentoMapper.agendamentoEntityFromObject(agendamentoPopulado);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao reagendar');
        }
    }

    async marcarRealizado(id: string, tenantId: string, userId: string): Promise<boolean> {
        try {
            const result = await AgendamentoModel.updateOne(
                { _id: id, tenant_id: tenantId },
                {
                    status: 'REALIZADO',
                    updated_by: userId,
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao marcar como realizado');
        }
    }

    async buscarProximosLembretes(tenantId: string, horasAntecedencia: number = 24): Promise<AgendamentoEntity[]> {
        try {
            const agora = new Date();
            const limite = new Date(agora.getTime() + horasAntecedencia * 60 * 60 * 1000);

            const agendamentos = await AgendamentoModel.find({
                tenant_id: tenantId,
                data_hora: { $gte: agora, $lte: limite },
                status: { $in: ['AGENDADO', 'CONFIRMADO'] },
                lembrete_enviado: { $ne: true }
            })
            .populate({
                path: 'paciente_id',
                populate: { path: 'pessoa_id', select: 'nome telefone' }
            })
            .populate({
                path: 'medico_id',
                populate: { path: 'pessoa_id', select: 'nome' }
            })
            .populate('unidade_id', 'nome endereco.logradouro endereco.numero')
            .sort({ data_hora: 1 });

            return agendamentos.map(agendamento => AgendamentoMapper.agendamentoEntityFromObject(agendamento));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar lembretes');
        }
    }

    async marcarLembreteEnviado(id: string, tenantId: string): Promise<boolean> {
        try {
            const result = await AgendamentoModel.updateOne(
                { _id: id, tenant_id: tenantId },
                { lembrete_enviado: true }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao marcar lembrete enviado');
        }
    }

    private async popularAgendamento(agendamentoId: string, tenantId: string): Promise<any> {
        return await AgendamentoModel.findOne({ _id: agendamentoId, tenant_id: tenantId })
            .populate({
                path: 'paciente_id',
                populate: { path: 'pessoa_id', select: 'nome cpf telefone email' }
            })
            .populate({
                path: 'medico_id',
                populate: { path: 'pessoa_id', select: 'nome' },
                select: 'crm especialidade'
            })
            .populate('unidade_id', 'nome tipo endereco')
            .populate('agendado_por', 'usuario');
    }
}