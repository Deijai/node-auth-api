// domain/use-cases/usuario/atualizar-usuario.use-case.ts
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { AtualizarUsuarioDto } from '../../dtos/usuario/atualizar-usuario.dto';
import { UsuarioEntity } from '../../entities/usuario.entity';
import { CustomError } from '../../errors/custom.error';

interface AtualizarUsuarioUseCase {
    execute(id: string, atualizarUsuarioDto: AtualizarUsuarioDto, tenantId: string, userId: string): Promise<UsuarioEntity>;
}

export class AtualizarUsuario implements AtualizarUsuarioUseCase {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    async execute(id: string, atualizarUsuarioDto: AtualizarUsuarioDto, tenantId: string, userId: string): Promise<UsuarioEntity> {
        // Verificar se usuário existe
        const usuarioExistente = await this.usuarioRepository.buscarPorId(id, tenantId);
        if (!usuarioExistente) {
            throw CustomError.notfound('Usuário não encontrado');
        }

        return await this.usuarioRepository.atualizar(id, atualizarUsuarioDto, tenantId, userId);
    }
}