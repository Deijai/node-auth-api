// infrastructure/repositories/usuario.repository.impl.ts
import { BuscarUsuarioResult, UsuarioDatasource } from "../../domain/datasources/usuario.datasource";
import { AlterarSenhaDto } from "../../domain/dtos/usuario/alterar-senha.dto";
import { AtualizarUsuarioDto } from "../../domain/dtos/usuario/atualizar-usuario.dto";
import { BuscarUsuarioDto } from "../../domain/dtos/usuario/buscar-usuario.dto";
import { CriarUsuarioDto } from "../../domain/dtos/usuario/criar-usuario.dto";
import { LoginUsuarioDto } from "../../domain/dtos/usuario/login-usuario.dto";
import { UsuarioEntity } from "../../domain/entities/usuario.entity";
import { UsuarioRepository } from "../../domain/repositories/usuario.repository";

export class UsuarioRepositoryImpl implements UsuarioRepository {
    constructor(private readonly usuarioDatasource: UsuarioDatasource) {}

    criar(criarUsuarioDto: CriarUsuarioDto, tenantId: string, userId: string): Promise<UsuarioEntity> {
        return this.usuarioDatasource.criar(criarUsuarioDto, tenantId, userId);
    }

    buscarPorId(id: string, tenantId: string): Promise<UsuarioEntity | null> {
        return this.usuarioDatasource.buscarPorId(id, tenantId);
    }

    buscarPorUsuario(usuario: string, tenantId: string): Promise<UsuarioEntity | null> {
        return this.usuarioDatasource.buscarPorUsuario(usuario, tenantId);
    }

    buscarPorPessoa(pessoaId: string, tenantId: string): Promise<UsuarioEntity | null> {
        return this.usuarioDatasource.buscarPorPessoa(pessoaId, tenantId);
    }

    buscar(buscarUsuarioDto: BuscarUsuarioDto, tenantId: string): Promise<BuscarUsuarioResult> {
        return this.usuarioDatasource.buscar(buscarUsuarioDto, tenantId);
    }

    login(loginUsuarioDto: LoginUsuarioDto, tenantId: string): Promise<UsuarioEntity> {
        return this.usuarioDatasource.login(loginUsuarioDto, tenantId);
    }

    atualizar(id: string, atualizarUsuarioDto: AtualizarUsuarioDto, tenantId: string, userId: string): Promise<UsuarioEntity> {
        return this.usuarioDatasource.atualizar(id, atualizarUsuarioDto, tenantId, userId);
    }

    alterarSenha(id: string, alterarSenhaDto: AlterarSenhaDto, tenantId: string): Promise<boolean> {
        return this.usuarioDatasource.alterarSenha(id, alterarSenhaDto, tenantId);
    }

    bloquearUsuario(id: string, tenantId: string, tempoMinutos?: number): Promise<boolean> {
        return this.usuarioDatasource.bloquearUsuario(id, tenantId, tempoMinutos);
    }

    desbloquearUsuario(id: string, tenantId: string): Promise<boolean> {
        return this.usuarioDatasource.desbloquearUsuario(id, tenantId);
    }

    registrarAcesso(id: string, tenantId: string): Promise<boolean> {
        return this.usuarioDatasource.registrarAcesso(id, tenantId);
    }

    incrementarTentativasLogin(id: string, tenantId: string): Promise<number> {
        return this.usuarioDatasource.incrementarTentativasLogin(id, tenantId);
    }

    resetarTentativasLogin(id: string, tenantId: string): Promise<boolean> {
        return this.usuarioDatasource.resetarTentativasLogin(id, tenantId);
    }

    deletar(id: string, tenantId: string): Promise<boolean> {
        return this.usuarioDatasource.deletar(id, tenantId);
    }
}