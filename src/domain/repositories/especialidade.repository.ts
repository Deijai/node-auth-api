// domain/repositories/especialidade.repository.ts
import { BuscarEspecialidadeResult } from '../datasources/especialidade.datasource';
import { AtualizarEspecialidadeDto } from '../dtos/especialidade/atualizar-especialidade.dto';
import { BuscarEspecialidadeDto } from '../dtos/especialidade/buscar-especialidade.dto';
import { CriarEspecialidadeDto } from '../dtos/especialidade/criar-especialidade.dto';
import { EspecialidadeEntity } from '../entities/especialidade.entity';

export abstract class EspecialidadeRepository {
    abstract criar(criarEspecialidadeDto: CriarEspecialidadeDto, tenantId: string, userId: string): Promise<EspecialidadeEntity>;
    abstract buscarPorId(id: string, tenantId: string): Promise<EspecialidadeEntity | null>;
    abstract buscarPorCodigo(codigo: string, tenantId: string): Promise<EspecialidadeEntity | null>;
    abstract buscar(buscarEspecialidadeDto: BuscarEspecialidadeDto, tenantId: string): Promise<BuscarEspecialidadeResult>;
    abstract buscarPorArea(area: string, tenantId: string): Promise<EspecialidadeEntity[]>;
    abstract buscarAtivas(tenantId: string): Promise<EspecialidadeEntity[]>;
    abstract atualizar(id: string, atualizarEspecialidadeDto: AtualizarEspecialidadeDto, tenantId: string, userId: string): Promise<EspecialidadeEntity>;
    abstract ativar(id: string, tenantId: string, userId: string): Promise<boolean>;
    abstract desativar(id: string, tenantId: string, userId: string): Promise<boolean>;
    abstract deletar(id: string, tenantId: string): Promise<boolean>;
}