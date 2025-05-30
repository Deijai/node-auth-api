// domain/datasources/usuario.datasource.ts

import { AlterarSenhaDto } from "../dtos/usuario/alterar-senha.dto";
import { AtualizarUsuarioDto } from "../dtos/usuario/atualizar-usuario.dto";
import { BuscarUsuarioDto } from "../dtos/usuario/buscar-usuario.dto";
import { CriarUsuarioDto } from "../dtos/usuario/criar-usuario.dto";
import { LoginUsuarioDto } from "../dtos/usuario/login-usuario.dto";
import { UsuarioEntity } from "../entities/usuario.entity";

export interface BuscarUsuarioResult {
    data: UsuarioEntity[];
    total: number;
    page: number;
    totalPages: number;
}

export interface LoginResult {
    token: string;
    usuario: {
        id: string;
        nome: string;
        usuario: string;
        papel: string;
        permissoes: string[];
        tenant_id: string;
    };
}

export abstract class UsuarioDatasource {
    abstract criar(criarUsuarioDto: CriarUsuarioDto, tenantId: string, userId: string): Promise<UsuarioEntity>;
    abstract buscarPorId(id: string, tenantId: string): Promise<UsuarioEntity | null>;
    abstract buscarPorUsuario(usuario: string, tenantId: string): Promise<UsuarioEntity | null>;
    abstract buscarPorPessoa(pessoaId: string, tenantId: string): Promise<UsuarioEntity | null>;
    abstract buscar(buscarUsuarioDto: BuscarUsuarioDto, tenantId: string): Promise<BuscarUsuarioResult>;
    abstract login(loginUsuarioDto: LoginUsuarioDto, tenantId: string): Promise<UsuarioEntity>;
    abstract atualizar(id: string, atualizarUsuarioDto: AtualizarUsuarioDto, tenantId: string, userId: string): Promise<UsuarioEntity>;
    abstract alterarSenha(id: string, alterarSenhaDto: AlterarSenhaDto, tenantId: string): Promise<boolean>;
    abstract bloquearUsuario(id: string, tenantId: string, tempoMinutos?: number): Promise<boolean>;
    abstract desbloquearUsuario(id: string, tenantId: string): Promise<boolean>;
    abstract registrarAcesso(id: string, tenantId: string): Promise<boolean>;
    abstract incrementarTentativasLogin(id: string, tenantId: string): Promise<number>;
    abstract resetarTentativasLogin(id: string, tenantId: string): Promise<boolean>;
    abstract deletar(id: string, tenantId: string): Promise<boolean>;
}