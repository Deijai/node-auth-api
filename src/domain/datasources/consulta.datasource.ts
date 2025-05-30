// domain/datasources/consulta.datasource.ts

import { BuscarConsultaDto } from "../dtos/consulta/buscar-consulta.dto";
import { CriarConsultaDto } from "../dtos/consulta/criar-consulta.dto";
import { FinalizarConsultaDto } from "../dtos/consulta/finalizar-consulta.dto";
import { IniciarAtendimentoDto } from "../dtos/consulta/iniciar-atendimento.dto";
import { ConsultaEntity } from "../entities/consulta.entity";

export interface BuscarConsultaResult {
    data: ConsultaEntity[];
    total: number;
    page: number;
    totalPages: number;
}

export interface EstatisticasConsulta {
    total_dia: number;
    total_mes: number;
    por_status: { [key: string]: number };
    tempo_medio_atendimento: number;
    taxa_nao_comparecimento: number;
}

export abstract class ConsultaDatasource {
    abstract criar(criarConsultaDto: CriarConsultaDto, tenantId: string, userId: string): Promise<ConsultaEntity>;
    abstract buscarPorId(id: string, tenantId: string): Promise<ConsultaEntity | null>;
    abstract buscar(buscarConsultaDto: BuscarConsultaDto, tenantId: string): Promise<BuscarConsultaResult>;
    abstract buscarPorPaciente(pacienteId: string, tenantId: string, limit?: number): Promise<ConsultaEntity[]>;
    abstract buscarPorMedico(medicoId: string, data: Date, tenantId: string): Promise<ConsultaEntity[]>;
    abstract buscarAgendaUnidade(unidadeId: string, data: Date, tenantId: string): Promise<ConsultaEntity[]>;
    abstract iniciarAtendimento(id: string, iniciarAtendimentoDto: IniciarAtendimentoDto, tenantId: string, userId: string): Promise<ConsultaEntity>;
    abstract finalizarConsulta(id: string, finalizarConsultaDto: FinalizarConsultaDto, tenantId: string, userId: string): Promise<ConsultaEntity>;
    abstract cancelarConsulta(id: string, motivo: string, tenantId: string, userId: string): Promise<boolean>;
    abstract marcarNaoCompareceu(id: string, tenantId: string, userId: string): Promise<boolean>;
    abstract obterEstatisticas(unidadeId: string, dataInicio: Date, dataFim: Date, tenantId: string): Promise<EstatisticasConsulta>;
    abstract verificarDisponibilidade(medicoId: string, dataHora: Date, duracao: number, tenantId: string): Promise<boolean>;
}