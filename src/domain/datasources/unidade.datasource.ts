// domain/datasources/unidade.datasource.ts

import { AtualizarUnidadeDto } from "../dtos/unidade/atualizar-unidade.dto";
import { BuscarUnidadeDto } from "../dtos/unidade/buscar-unidade.dto";
import { CriarUnidadeDto } from "../dtos/unidade/criar-unidade.dto";
import { UnidadeEntity } from "../entities/unidade.entity";

export interface BuscarUnidadeResult {
    data: UnidadeEntity[];
    total: number;
    page: number;
    totalPages: number;
}

export interface EstatisticasUnidade {
    total_atendimentos_mes: number;
    total_pacientes_unicos: number;
    especialidades_ativas: number;
    ocupacao_leitos?: number;
    equipamentos_funcionando: number;
    equipamentos_manutencao: number;
}

export abstract class UnidadeDatasource {
    abstract criar(criarUnidadeDto: CriarUnidadeDto, tenantId: string, userId: string): Promise<UnidadeEntity>;
    abstract buscarPorId(id: string, tenantId: string): Promise<UnidadeEntity | null>;
    abstract buscarPorCnes(cnes: string, tenantId: string): Promise<UnidadeEntity | null>;
    abstract buscar(buscarUnidadeDto: BuscarUnidadeDto, tenantId: string): Promise<BuscarUnidadeResult>;
    abstract buscarPorTipo(tipo: string, tenantId: string): Promise<UnidadeEntity[]>;
    abstract buscarPorEspecialidade(especialidade: string, tenantId: string): Promise<UnidadeEntity[]>;
    abstract buscarProximas(latitude: number, longitude: number, raioKm: number, tenantId: string): Promise<UnidadeEntity[]>;
    abstract obterEstatisticas(id: string, tenantId: string): Promise<EstatisticasUnidade>;
    abstract atualizar(id: string, atualizarUnidadeDto: AtualizarUnidadeDto, tenantId: string, userId: string): Promise<UnidadeEntity>;
    abstract deletar(id: string, tenantId: string): Promise<boolean>;
}