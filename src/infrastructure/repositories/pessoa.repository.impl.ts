// infrastructure/repositories/pessoa.repository.impl.ts
import { 
    CriarPessoaDto, 
    AtualizarPessoaDto, BuscarPessoaDto, PessoaEntity 
} from "../../domain";
import { BuscarPessoaResult, PessoaDatasource } from "../../domain/datasources/pessoa.datasource";
import { PessoaRepository } from "../../domain/repositories/pessoa.repository";

export class PessoaRepositoryImpl implements PessoaRepository {
    constructor(private readonly pessoaDatasource: PessoaDatasource) {}

    criar(criarPessoaDto: CriarPessoaDto, tenantId: string, userId: string): Promise<PessoaEntity> {
        return this.pessoaDatasource.criar(criarPessoaDto, tenantId, userId);
    }

    buscarPorId(id: string, tenantId: string): Promise<PessoaEntity | null> {
        return this.pessoaDatasource.buscarPorId(id, tenantId);
    }

    buscarPorCpf(cpf: string, tenantId: string): Promise<PessoaEntity | null> {
        return this.pessoaDatasource.buscarPorCpf(cpf, tenantId);
    }

    buscar(buscarPessoaDto: BuscarPessoaDto, tenantId: string): Promise<BuscarPessoaResult> {
        return this.pessoaDatasource.buscar(buscarPessoaDto, tenantId);
    }

    atualizar(id: string, atualizarPessoaDto: AtualizarPessoaDto, tenantId: string, userId: string): Promise<PessoaEntity> {
        return this.pessoaDatasource.atualizar(id, atualizarPessoaDto, tenantId, userId);
    }

    deletar(id: string, tenantId: string): Promise<boolean> {
        return this.pessoaDatasource.deletar(id, tenantId);
    }
}