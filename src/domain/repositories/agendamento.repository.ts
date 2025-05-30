// domain/repositories/agendamento.repository.ts
import { BuscarAgendamentoResult, DisponibilidadeHorario, AgendaDia } from '../datasources/agendamento.datasource';
import { AtualizarAgendamentoDto } from '../dtos/agendamento/atualizar-agendamento.dto';
import { BuscarAgendamentoDto } from '../dtos/agendamento/buscar-agendamento.dto';
import { CancelarAgendamentoDto } from '../dtos/agendamento/cancelar-agendamento.dto';
import { CriarAgendamentoDto } from '../dtos/agendamento/criar-agendamento.dto';
import { AgendamentoEntity } from '../entities/agendamento.entity';

export abstract class AgendamentoRepository {
    abstract criar(criarAgendamentoDto: CriarAgendamentoDto, tenantId: string, userId: string): Promise<AgendamentoEntity>;
    abstract buscarPorId(id: string, tenantId: string): Promise<AgendamentoEntity | null>;
    abstract buscar(buscarAgendamentoDto: BuscarAgendamentoDto, tenantId: string): Promise<BuscarAgendamentoResult>;
    abstract buscarPorPaciente(pacienteId: string, tenantId: string): Promise<AgendamentoEntity[]>;
    abstract buscarPorMedico(medicoId: string, data: Date, tenantId: string): Promise<AgendamentoEntity[]>;
    abstract buscarAgendaDia(medicoId: string, data: Date, tenantId: string): Promise<AgendaDia>;
    abstract verificarDisponibilidade(medicoId: string, dataHora: Date, duracao: number, tenantId: string, excluirId?: string): Promise<boolean>;
    abstract obterHorariosDisponiveis(medicoId: string, data: Date, tenantId: string): Promise<DisponibilidadeHorario[]>;
    abstract atualizar(id: string, atualizarAgendamentoDto: AtualizarAgendamentoDto, tenantId: string, userId: string): Promise<AgendamentoEntity>;
    abstract confirmar(id: string, tenantId: string, userId: string): Promise<boolean>;
    abstract cancelar(id: string, cancelarAgendamentoDto: CancelarAgendamentoDto, tenantId: string, userId: string): Promise<boolean>;
    abstract reagendar(id: string, novaDataHora: Date, tenantId: string, userId: string): Promise<AgendamentoEntity>;
    abstract marcarRealizado(id: string, tenantId: string, userId: string): Promise<boolean>;
    abstract buscarProximosLembretes(tenantId: string, horasAntecedencia?: number): Promise<AgendamentoEntity[]>;
    abstract marcarLembreteEnviado(id: string, tenantId: string): Promise<boolean>;
}