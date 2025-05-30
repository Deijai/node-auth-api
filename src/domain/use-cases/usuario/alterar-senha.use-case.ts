// domain/use-cases/usuario/alterar-senha.use-case.ts
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { AlterarSenhaDto } from '../../dtos/usuario/alterar-senha.dto';
import { CustomError } from '../../errors/custom.error';

interface AlterarSenhaUseCase {
    execute(id: string, alterarSenhaDto: AlterarSenhaDto, tenantId: string): Promise<boolean>;
}

export class AlterarSenha implements AlterarSenhaUseCase {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    async execute(id: string, alterarSenhaDto: AlterarSenhaDto, tenantId: string): Promise<boolean> {
        // Verificar se usuário existe
        const usuario = await this.usuarioRepository.buscarPorId(id, tenantId);
        if (!usuario) {
            throw CustomError.notfound('Usuário não encontrado');
        }

        return await this.usuarioRepository.alterarSenha(id, alterarSenhaDto, tenantId);
    }
}