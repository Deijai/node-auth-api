// infrastructure/repositories/unidade.repository.impl.ts
import { BuscarUnidadeResult, EstatisticasUnidade, UnidadeDatasource } from "../../domain/datasources/unidade.datasource";
import { AtualizarUnidadeDto } from "../../domain/dtos/unidade/atualizar-unidade.dto";
import { BuscarUnidadeDto } from "../../domain/dtos/unidade/buscar-unidade.dto";
import { CriarUnidadeDto } from "../../domain/dtos/unidade/criar-unidade.dto";
import { UnidadeEntity } from "../../domain/entities/unidade.entity";
import { UnidadeRepository } from "../../domain/repositories/unidade.repository";

export class UnidadeRepositoryImpl implements UnidadeRepository {
    constructor(private readonly unidadeDatasource: UnidadeDatasource) {}

    criar(criarUnidadeDto: CriarUnidadeDto, tenantId: string, userId: string): Promise<UnidadeEntity> {
        return this.unidadeDatasource.criar(criarUnidadeDto, tenantId, userId);
    }

    buscarPorId(id: string, tenantId: string): Promise<UnidadeEntity | null> {
        return this.unidadeDatasource.buscarPorId(id, tenantId);
    }

    buscarPorCnes(cnes: string, tenantId: string): Promise<UnidadeEntity | null> {
        return this.unidadeDatasource.buscarPorCnes(cnes, tenantId);
    }

    buscar(buscarUnidadeDto: BuscarUnidadeDto, tenantId: string): Promise<BuscarUnidadeResult> {
        return this.unidadeDatasource.buscar(buscarUnidadeDto, tenantId);
    }

    buscarPorTipo(tipo: string, tenantId: string): Promise<UnidadeEntity[]> {
        return this.unidadeDatasource.buscarPorTipo(tipo, tenantId);
    }

    buscarPorEspecialidade(especialidade: string, tenantId: string): Promise<UnidadeEntity[]> {
        return this.unidadeDatasource.buscarPorEspecialidade(especialidade, tenantId);
    }

    buscarProximas(latitude: number, longitude: number, raioKm: number, tenantId: string): Promise<UnidadeEntity[]> {
        return this.unidadeDatasource.buscarProximas(latitude, longitude, raioKm, tenantId);
    }

    obterEstatisticas(id: string, tenantId: string): Promise<EstatisticasUnidade> {
        return this.unidadeDatasource.obterEstatisticas(id, tenantId);
    }

    atualizar(id: string, atualizarUnidadeDto: AtualizarUnidadeDto, tenantId: string, userId: string): Promise<UnidadeEntity> {
        return this.unidadeDatasource.atualizar(id, atualizarUnidadeDto, tenantId, userId);
    }

    deletar(id: string, tenantId: string): Promise<boolean> {
        return this.unidadeDatasource.deletar(id, tenantId);
    }
}