// domain/use-cases/pessoa/buscar-pessoa.use-case.ts
import { PessoaRepository } from '../../repositories/pessoa.repository';
import { BuscarPessoaDto } from '../../dtos/pessoa/buscar-pessoa.dto';
import { BuscarPessoaResult } from '../../datasources/pessoa.datasource';

interface BuscarPessoaUseCase {
    execute(buscarPessoaDto: BuscarPessoaDto, tenantId: string): Promise<BuscarPessoaResult>;
}

export class BuscarPessoa implements BuscarPessoaUseCase {
    constructor(private readonly pessoaRepository: PessoaRepository) {}

    async execute(buscarPessoaDto: BuscarPessoaDto, tenantId: string): Promise<BuscarPessoaResult> {
        return await this.pessoaRepository.buscar(buscarPessoaDto, tenantId);
    }
}