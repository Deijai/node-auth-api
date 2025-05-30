// domain/use-cases/usuario/criar-usuario.use-case.ts
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { PessoaRepository } from '../../repositories/pessoa.repository';
import { CriarUsuarioDto } from '../../dtos/usuario/criar-usuario.dto';
import { UsuarioEntity } from '../../entities/usuario.entity';
import { CustomError } from '../../errors/custom.error';

interface CriarUsuarioUseCase {
    execute(criarUsuarioDto: CriarUsuarioDto, tenantId: string, userId: string): Promise<UsuarioEntity>;
}

export class CriarUsuario implements CriarUsuarioUseCase {
    constructor(
        private readonly usuarioRepository: UsuarioRepository,
        private readonly pessoaRepository: PessoaRepository
    ) {}

    async execute(criarUsuarioDto: CriarUsuarioDto, tenantId: string, userId: string): Promise<UsuarioEntity> {
        // Verificar se nome de usuário já existe
        const usuarioExistente = await this.usuarioRepository.buscarPorUsuario(criarUsuarioDto.usuario, tenantId);
        if (usuarioExistente) {
            throw CustomError.badRequest('Nome de usuário já existe neste município');
        }

        // Verificar se pessoa existe (se fornecida)
        if (criarUsuarioDto.pessoa_id) {
            const pessoa = await this.pessoaRepository.buscarPorId(criarUsuarioDto.pessoa_id, tenantId);
            if (!pessoa) {
                throw CustomError.badRequest('Pessoa não encontrada');
            }

            // Verificar se já existe usuário para esta pessoa
            const usuarioPorPessoa = await this.usuarioRepository.buscarPorPessoa(criarUsuarioDto.pessoa_id, tenantId);
            if (usuarioPorPessoa) {
                throw CustomError.badRequest('Já existe um usuário cadastrado para esta pessoa');
            }
        }

        return await this.usuarioRepository.criar(criarUsuarioDto, tenantId, userId);
    }
}