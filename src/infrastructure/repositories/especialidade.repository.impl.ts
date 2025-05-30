// infrastructure/repositories/especialidade.repository.impl.ts
import { BuscarEspecialidadeResult, EspecialidadeDatasource } from "../../domain/datasources/especialidade.datasource";
import { AtualizarEspecialidadeDto } from "../../domain/dtos/especialidade/atualizar-especialidade.dto";
import { BuscarEspecialidadeDto } from "../../domain/dtos/especialidade/buscar-especialidade.dto";
import { CriarEspecialidadeDto } from "../../domain/dtos/especialidade/criar-especialidade.dto";
import { EspecialidadeEntity } from "../../domain/entities/especialidade.entity";
import { EspecialidadeRepository } from "../../domain/repositories/especialidade.repository";

export class EspecialidadeRepositoryImpl implements EspecialidadeRepository {
    constructor(private readonly especialidadeDatasource: EspecialidadeDatasource) {}

    criar(criarEspecialidadeDto: CriarEspecialidadeDto, tenantId: string, userId: string): Promise<EspecialidadeEntity> {
        return this.especialidadeDatasource.criar(criarEspecialidadeDto, tenantId, userId);
    }

    buscarPorId(id: string, tenantId: string): Promise<EspecialidadeEntity | null> {
        return this.especialidadeDatasource.buscarPorId(id, tenantId);
    }

    buscarPorCodigo(codigo: string, tenantId: string): Promise<EspecialidadeEntity | null> {
        return this.especialidadeDatasource.buscarPorCodigo(codigo, tenantId);
    }

    buscar(buscarEspecialidadeDto: BuscarEspecialidadeDto, tenantId: string): Promise<BuscarEspecialidadeResult> {
        return this.especialidadeDatasource.buscar(buscarEspecialidadeDto, tenantId);
    }

    buscarPorArea(area: string, tenantId: string): Promise<EspecialidadeEntity[]> {
        return this.especialidadeDatasource.buscarPorArea(area, tenantId);
    }

    buscarAtivas(tenantId: string): Promise<EspecialidadeEntity[]> {
        return this.especialidadeDatasource.buscarAtivas(tenantId);
    }

    atualizar(id: string, atualizarEspecialidadeDto: AtualizarEspecialidadeDto, tenantId: string, userId: string): Promise<EspecialidadeEntity> {
        return this.especialidadeDatasource.atualizar(id, atualizarEspecialidadeDto, tenantId, userId);
    }

    ativar(id: string, tenantId: string, userId: string): Promise<boolean> {
        return this.especialidadeDatasource.ativar(id, tenantId, userId);
    }

    desativar(id: string, tenantId: string, userId: string): Promise<boolean> {
        return this.especialidadeDatasource.desativar(id, tenantId, userId);
    }

    deletar(id: string, tenantId: string): Promise<boolean> {
        return this.especialidadeDatasource.deletar(id, tenantId);
    }
}