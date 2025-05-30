// infrastructure/repositories/agendamento.repository.impl.ts
import { BuscarAgendamentoResult, DisponibilidadeHorario, AgendaDia, AgendamentoDatasource } from "../../domain/datasources/agendamento.datasource";
import { AtualizarAgendamentoDto } from "../../domain/dtos/agendamento/atualizar-agendamento.dto";
import { BuscarAgendamentoDto } from "../../domain/dtos/agendamento/buscar-agendamento.dto";
import { CancelarAgendamentoDto } from "../../domain/dtos/agendamento/cancelar-agendamento.dto";
import { CriarAgendamentoDto } from "../../domain/dtos/agendamento/criar-agendamento.dto";
import { AgendamentoEntity } from "../../domain/entities/agendamento.entity";
import { AgendamentoRepository } from "../../domain/repositories/agendamento.repository";

export class AgendamentoRepositoryImpl implements AgendamentoRepository {
    constructor(private readonly agendamentoDatasource: AgendamentoDatasource) {}

    criar(criarAgendamentoDto: CriarAgendamentoDto, tenantId: string, userId: string): Promise<AgendamentoEntity> {
        return this.agendamentoDatasource.criar(criarAgendamentoDto, tenantId, userId);
    }

    buscarPorId(id: string, tenantId: string): Promise<AgendamentoEntity | null> {
        return this.agendamentoDatasource.buscarPorId(id, tenantId);
    }

    buscar(buscarAgendamentoDto: BuscarAgendamentoDto, tenantId: string): Promise<BuscarAgendamentoResult> {
        return this.agendamentoDatasource.buscar(buscarAgendamentoDto, tenantId);
    }

    buscarPorPaciente(pacienteId: string, tenantId: string): Promise<AgendamentoEntity[]> {
        return this.agendamentoDatasource.buscarPorPaciente(pacienteId, tenantId);
    }

    buscarPorMedico(medicoId: string, data: Date, tenantId: string): Promise<AgendamentoEntity[]> {
        return this.agendamentoDatasource.buscarPorMedico(medicoId, data, tenantId);
    }

    buscarAgendaDia(medicoId: string, data: Date, tenantId: string): Promise<AgendaDia> {
        return this.agendamentoDatasource.buscarAgendaDia(medicoId, data, tenantId);
    }

    verificarDisponibilidade(medicoId: string, dataHora: Date, duracao: number, tenantId: string, excluirId?: string): Promise<boolean> {
        return this.agendamentoDatasource.verificarDisponibilidade(medicoId, dataHora, duracao, tenantId, excluirId);
    }

    obterHorariosDisponiveis(medicoId: string, data: Date, tenantId: string): Promise<DisponibilidadeHorario[]> {
        return this.agendamentoDatasource.obterHorariosDisponiveis(medicoId, data, tenantId);
    }

    atualizar(id: string, atualizarAgendamentoDto: AtualizarAgendamentoDto, tenantId: string, userId: string): Promise<AgendamentoEntity> {
        return this.agendamentoDatasource.atualizar(id, atualizarAgendamentoDto, tenantId, userId);
    }

    confirmar(id: string, tenantId: string, userId: string): Promise<boolean> {
        return this.agendamentoDatasource.confirmar(id, tenantId, userId);
    }

    cancelar(id: string, cancelarAgendamentoDto: CancelarAgendamentoDto, tenantId: string, userId: string): Promise<boolean> {
        return this.agendamentoDatasource.cancelar(id, cancelarAgendamentoDto, tenantId, userId);
    }

    reagendar(id: string, novaDataHora: Date, tenantId: string, userId: string): Promise<AgendamentoEntity> {
        return this.agendamentoDatasource.reagendar(id, novaDataHora, tenantId, userId);
    }

    marcarRealizado(id: string, tenantId: string, userId: string): Promise<boolean> {
        return this.agendamentoDatasource.marcarRealizado(id, tenantId, userId);
    }

    buscarProximosLembretes(tenantId: string, horasAntecedencia?: number): Promise<AgendamentoEntity[]> {
        return this.agendamentoDatasource.buscarProximosLembretes(tenantId, horasAntecedencia);
    }

    marcarLembreteEnviado(id: string, tenantId: string): Promise<boolean> {
        return this.agendamentoDatasource.marcarLembreteEnviado(id, tenantId);
    }
}