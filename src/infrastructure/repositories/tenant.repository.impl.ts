// infrastructure/repositories/tenant.repository.impl.ts
import { BuscarTenantResult, EstatisticasTenant, TenantDatasource } from "../../domain/datasources/tenant.datasource";
import { AtualizarTenantDto } from "../../domain/dtos/tenant/atualizar-tenant.dto";
import { BuscarTenantDto } from "../../domain/dtos/tenant/buscar-tenant.dto";
import { ConfigurarTenantDto } from "../../domain/dtos/tenant/configurar-tenant.dto";
import { CriarTenantDto } from "../../domain/dtos/tenant/criar-tenant.dto";
import { TenantEntity } from "../../domain/entities/tenant.entity";
import { TenantRepository } from "../../domain/repositories/tenant.repository";

export class TenantRepositoryImpl implements TenantRepository {
    constructor(private readonly tenantDatasource: TenantDatasource) {}

    criar(criarTenantDto: CriarTenantDto, userId: string): Promise<TenantEntity> {
        return this.tenantDatasource.criar(criarTenantDto, userId);
    }

    buscarPorId(id: string): Promise<TenantEntity | null> {
        return this.tenantDatasource.buscarPorId(id);
    }

    buscarPorCodigo(codigo: string): Promise<TenantEntity | null> {
        return this.tenantDatasource.buscarPorCodigo(codigo);
    }

    buscarPorSubdomain(subdomain: string): Promise<TenantEntity | null> {
        return this.tenantDatasource.buscarPorSubdomain(subdomain);
    }

    buscarPorCnpj(cnpj: string): Promise<TenantEntity | null> {
        return this.tenantDatasource.buscarPorCnpj(cnpj);
    }

    buscar(buscarTenantDto: BuscarTenantDto): Promise<BuscarTenantResult> {
        return this.tenantDatasource.buscar(buscarTenantDto);
    }

    atualizar(id: string, atualizarTenantDto: AtualizarTenantDto, userId: string): Promise<TenantEntity> {
        return this.tenantDatasource.atualizar(id, atualizarTenantDto, userId);
    }

    configurar(id: string, configurarTenantDto: ConfigurarTenantDto, userId: string): Promise<TenantEntity> {
        return this.tenantDatasource.configurar(id, configurarTenantDto, userId);
    }

    atualizarPlano(id: string, plano: any, userId: string): Promise<TenantEntity> {
        return this.tenantDatasource.atualizarPlano(id, plano, userId);
    }

    obterEstatisticas(id: string): Promise<EstatisticasTenant> {
        return this.tenantDatasource.obterEstatisticas(id);
    }

    verificarLimites(id: string): Promise<{ [limite: string]: { atual: number; maximo: number; excedeu: boolean } }> {
        return this.tenantDatasource.verificarLimites(id);
    }

    suspender(id: string, motivo: string, userId: string): Promise<boolean> {
        return this.tenantDatasource.suspender(id, motivo, userId);
    }

    reativar(id: string, userId: string): Promise<boolean> {
        return this.tenantDatasource.reativar(id, userId);
    }

    deletar(id: string): Promise<boolean> {
        return this.tenantDatasource.deletar(id);
    }
}