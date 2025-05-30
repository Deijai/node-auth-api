// domain/datasources/pessoa.datasource.ts
import { CriarPessoaDto, AtualizarPessoaDto, BuscarPessoaDto, PessoaEntity } from '../index';

export interface BuscarPessoaResult {
    data: PessoaEntity[];
    total: number;
    page: number;
    totalPages: number;
}

export abstract class PessoaDatasource {
    abstract criar(criarPessoaDto: CriarPessoaDto, tenantId: string, userId: string): Promise<PessoaEntity>;
    abstract buscarPorId(id: string, tenantId: string): Promise<PessoaEntity | null>;
    abstract buscarPorCpf(cpf: string, tenantId: string): Promise<PessoaEntity | null>;
    abstract buscar(buscarPessoaDto: BuscarPessoaDto, tenantId: string): Promise<BuscarPessoaResult>;
    abstract atualizar(id: string, atualizarPessoaDto: AtualizarPessoaDto, tenantId: string, userId: string): Promise<PessoaEntity>;
    abstract deletar(id: string, tenantId: string): Promise<boolean>;
}