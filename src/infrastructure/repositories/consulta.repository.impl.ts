// infrastructure/repositories/consulta.repository.impl.ts
import { BuscarConsultaResult, ConsultaDatasource, EstatisticasConsulta } from "../../domain/datasources/consulta.datasource";
import { BuscarConsultaDto } from "../../domain/dtos/consulta/buscar-consulta.dto";
import { CriarConsultaDto } from "../../domain/dtos/consulta/criar-consulta.dto";
import { FinalizarConsultaDto } from "../../domain/dtos/consulta/finalizar-consulta.dto";
import { IniciarAtendimentoDto } from "../../domain/dtos/consulta/iniciar-atendimento.dto";
import { ConsultaEntity } from "../../domain/entities/consulta.entity";
import { ConsultaRepository } from "../../domain/repositories/consulta.repository";

export class ConsultaRepositoryImpl implements ConsultaRepository {
    constructor(private readonly consultaDatasource: ConsultaDatasource) {}

    criar(criarConsultaDto: CriarConsultaDto, tenantId: string, userId: string): Promise<ConsultaEntity> {
        return this.consultaDatasource.criar(criarConsultaDto, tenantId, userId);
    }

    buscarPorId(id: string, tenantId: string): Promise<ConsultaEntity | null> {
        return this.consultaDatasource.buscarPorId(id, tenantId);
    }

    buscar(buscarConsultaDto: BuscarConsultaDto, tenantId: string): Promise<BuscarConsultaResult> {
        return this.consultaDatasource.buscar(buscarConsultaDto, tenantId);
    }

    buscarPorPaciente(pacienteId: string, tenantId: string, limit?: number): Promise<ConsultaEntity[]> {
        return this.consultaDatasource.buscarPorPaciente(pacienteId, tenantId, limit);
    }

    buscarPorMedico(medicoId: string, data: Date, tenantId: string): Promise<ConsultaEntity[]> {
        return this.consultaDatasource.buscarPorMedico(medicoId, data, tenantId);
    }

    buscarAgendaUnidade(unidadeId: string, data: Date, tenantId: string): Promise<ConsultaEntity[]> {
        return this.consultaDatasource.buscarAgendaUnidade(unidadeId, data, tenantId);
    }

    iniciarAtendimento(id: string, iniciarAtendimentoDto: IniciarAtendimentoDto, tenantId: string, userId: string): Promise<ConsultaEntity> {
        return this.consultaDatasource.iniciarAtendimento(id, iniciarAtendimentoDto, tenantId, userId);
    }

    finalizarConsulta(id: string, finalizarConsultaDto: FinalizarConsultaDto, tenantId: string, userId: string): Promise<ConsultaEntity> {
        return this.consultaDatasource.finalizarConsulta(id, finalizarConsultaDto, tenantId, userId);
    }

    cancelarConsulta(id: string, motivo: string, tenantId: string, userId: string): Promise<boolean> {
        return this.consultaDatasource.cancelarConsulta(id, motivo, tenantId, userId);
    }

    marcarNaoCompareceu(id: string, tenantId: string, userId: string): Promise<boolean> {
        return this.consultaDatasource.marcarNaoCompareceu(id, tenantId, userId);
    }

    obterEstatisticas(unidadeId: string, dataInicio: Date, dataFim: Date, tenantId: string): Promise<EstatisticasConsulta> {
        return this.consultaDatasource.obterEstatisticas(unidadeId, dataInicio, dataFim, tenantId);
    }

    verificarDisponibilidade(medicoId: string, dataHora: Date, duracao: number, tenantId: string): Promise<boolean> {
        return this.consultaDatasource.verificarDisponibilidade(medicoId, dataHora, duracao, tenantId);
    }
}