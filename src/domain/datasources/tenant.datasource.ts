// domain/datasources/tenant.datasource.ts

import { AtualizarTenantDto } from "../dtos/tenant/atualizar-tenant.dto";
import { BuscarTenantDto } from "../dtos/tenant/buscar-tenant.dto";
import { ConfigurarTenantDto } from "../dtos/tenant/configurar-tenant.dto";
import { CriarTenantDto } from "../dtos/tenant/criar-tenant.dto";
import { TenantEntity } from "../entities/tenant.entity";

export interface BuscarTenantResult {
    data: TenantEntity[];
    total: number;
    page: number;
    totalPages: number;
}

export interface EstatisticasTenant {
    total_usuarios: number;
    total_pacientes: number;
    total_unidades: number;
    total_consultas_mes: number;
    armazenamento_usado_gb: number;
    ultimo_acesso: Date;
    uso_por_modulo: { [modulo: string]: number };
}

export abstract class TenantDatasource {
    abstract criar(criarTenantDto: CriarTenantDto, userId: string): Promise<TenantEntity>;
    abstract buscarPorId(id: string): Promise<TenantEntity | null>;
    abstract buscarPorCodigo(codigo: string): Promise<TenantEntity | null>;
    abstract buscarPorSubdomain(subdomain: string): Promise<TenantEntity | null>;
    abstract buscarPorCnpj(cnpj: string): Promise<TenantEntity | null>;
    abstract buscar(buscarTenantDto: BuscarTenantDto): Promise<BuscarTenantResult>;
    abstract atualizar(id: string, atualizarTenantDto: AtualizarTenantDto, userId: string): Promise<TenantEntity>;
    abstract configurar(id: string, configurarTenantDto: ConfigurarTenantDto, userId: string): Promise<TenantEntity>;
    abstract atualizarPlano(id: string, plano: any, userId: string): Promise<TenantEntity>;
    abstract obterEstatisticas(id: string): Promise<EstatisticasTenant>;
    abstract verificarLimites(id: string): Promise<{ [limite: string]: { atual: number; maximo: number; excedeu: boolean } }>;
    abstract suspender(id: string, motivo: string, userId: string): Promise<boolean>;
    abstract reativar(id: string, userId: string): Promise<boolean>;
    abstract deletar(id: string): Promise<boolean>;
}