// domain/repositories/unidade.repository.ts
import { BuscarUnidadeResult, EstatisticasUnidade } from '../datasources/unidade.datasource';
import { AtualizarUnidadeDto } from '../dtos/unidade/atualizar-unidade.dto';
import { BuscarUnidadeDto } from '../dtos/unidade/buscar-unidade.dto';
import { CriarUnidadeDto } from '../dtos/unidade/criar-unidade.dto';
import { UnidadeEntity } from '../entities/unidade.entity';

export abstract class UnidadeRepository {
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