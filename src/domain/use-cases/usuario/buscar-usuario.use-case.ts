// domain/use-cases/usuario/buscar-usuario.use-case.ts
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { BuscarUsuarioDto } from '../../dtos/usuario/buscar-usuario.dto';
import { BuscarUsuarioResult } from '../../datasources/usuario.datasource';

interface BuscarUsuarioUseCase {
    execute(buscarUsuarioDto: BuscarUsuarioDto, tenantId: string): Promise<BuscarUsuarioResult>;
}

export class BuscarUsuario implements BuscarUsuarioUseCase {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    async execute(buscarUsuarioDto: BuscarUsuarioDto, tenantId: string): Promise<BuscarUsuarioResult> {
        return await this.usuarioRepository.buscar(buscarUsuarioDto, tenantId);
    }
}