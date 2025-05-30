// domain/use-cases/pessoa/atualizar-pessoa.use-case.ts
import { PessoaRepository } from '../../repositories/pessoa.repository';
import { AtualizarPessoaDto } from '../../dtos/pessoa/atualizar-pessoa.dto';
import { PessoaEntity } from '../../entities/pessoa.entity';
import { CustomError } from '../../errors/custom.error';

interface AtualizarPessoaUseCase {
    execute(id: string, atualizarPessoaDto: AtualizarPessoaDto, tenantId: string, userId: string): Promise<PessoaEntity>;
}

export class AtualizarPessoa implements AtualizarPessoaUseCase {
    constructor(private readonly pessoaRepository: PessoaRepository) {}

    async execute(id: string, atualizarPessoaDto: AtualizarPessoaDto, tenantId: string, userId: string): Promise<PessoaEntity> {
        // Verificar se pessoa existe
        const pessoaExistente = await this.pessoaRepository.buscarPorId(id, tenantId);
        if (!pessoaExistente) {
            throw CustomError.notfound('Pessoa não encontrada');
        }

        return await this.pessoaRepository.atualizar(id, atualizarPessoaDto, tenantId, userId);
    }
}