// domain/use-cases/pessoa/criar-pessoa.use-case.ts
import { PessoaRepository } from '../../repositories/pessoa.repository';
import { CriarPessoaDto } from '../../dtos/pessoa/criar-pessoa.dto';
import { PessoaEntity } from '../../entities/pessoa.entity';
import { CustomError } from '../../errors/custom.error';

interface CriarPessoaUseCase {
    execute(criarPessoaDto: CriarPessoaDto, tenantId: string, userId: string): Promise<PessoaEntity>;
}

export class CriarPessoa implements CriarPessoaUseCase {
    constructor(private readonly pessoaRepository: PessoaRepository) {}

    async execute(criarPessoaDto: CriarPessoaDto, tenantId: string, userId: string): Promise<PessoaEntity> {
        // Verificar se CPF já existe no tenant
        const pessoaExistente = await this.pessoaRepository.buscarPorCpf(criarPessoaDto.cpf, tenantId);
        if (pessoaExistente) {
            throw CustomError.badRequest('CPF já cadastrado neste município');
        }

        return await this.pessoaRepository.criar(criarPessoaDto, tenantId, userId);
    }
}
