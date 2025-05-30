// domain/repositories/usuario.repository.ts
import { BuscarUsuarioResult, LoginResult } from '../datasources/usuario.datasource';
import { AlterarSenhaDto } from '../dtos/usuario/alterar-senha.dto';
import { AtualizarUsuarioDto } from '../dtos/usuario/atualizar-usuario.dto';
import { BuscarUsuarioDto } from '../dtos/usuario/buscar-usuario.dto';
import { CriarUsuarioDto } from '../dtos/usuario/criar-usuario.dto';
import { LoginUsuarioDto } from '../dtos/usuario/login-usuario.dto';
import { UsuarioEntity } from '../entities/usuario.entity';

export abstract class UsuarioRepository {
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