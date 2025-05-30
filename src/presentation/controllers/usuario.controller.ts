// presentation/controllers/usuario.controller.ts
import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { AlterarSenhaDto } from '../../domain/dtos/usuario/alterar-senha.dto';
import { AtualizarUsuarioDto } from '../../domain/dtos/usuario/atualizar-usuario.dto';
import { BuscarUsuarioDto } from '../../domain/dtos/usuario/buscar-usuario.dto';
import { CriarUsuarioDto } from '../../domain/dtos/usuario/criar-usuario.dto';
import { LoginUsuarioDto } from '../../domain/dtos/usuario/login-usuario.dto';
import { PessoaRepository } from '../../domain/repositories/pessoa.repository';
import { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import { AlterarSenha } from '../../domain/use-cases/usuario/alterar-senha.use-case';
import { AtualizarUsuario } from '../../domain/use-cases/usuario/atualizar-usuario.use-case';
import { BuscarUsuario } from '../../domain/use-cases/usuario/buscar-usuario.use-case';
import { CriarUsuario } from '../../domain/use-cases/usuario/criar-usuario.use-case';
import { LoginUsuario } from '../../domain/use-cases/usuario/login-usuario.use-case';

export class UsuarioController {
    constructor(
        private readonly usuarioRepository: UsuarioRepository,
        private readonly pessoaRepository: PessoaRepository
    ) {}

    criarUsuario = (req: Request, res: Response) => {
        const [error, criarUsuarioDto] = CriarUsuarioDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new CriarUsuario(this.usuarioRepository, this.pessoaRepository)
            .execute(criarUsuarioDto!, tenantId, userId)
            .then(usuario => res.status(201).json(usuario))
            .catch(error => this.handleError(error, res));
    };

    buscarUsuarios = (req: Request, res: Response) => {
        const [error, buscarUsuarioDto] = BuscarUsuarioDto.create(req.query);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;

        new BuscarUsuario(this.usuarioRepository)
            .execute(buscarUsuarioDto!, tenantId)
            .then(resultado => res.json(resultado))
            .catch(error => this.handleError(error, res));
    };

    buscarUsuarioPorId = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.usuarioRepository.buscarPorId(id, tenantId)
            .then(usuario => {
                if (!usuario) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                res.json(usuario);
            })
            .catch(error => this.handleError(error, res));
    };

    loginUsuario = (req: Request, res: Response) => {
        const [error, loginUsuarioDto] = LoginUsuarioDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;

        new LoginUsuario(this.usuarioRepository)
            .execute(loginUsuarioDto!, tenantId)
            .then(resultado => res.json(resultado))
            .catch(error => this.handleError(error, res));
    };

    atualizarUsuario = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, atualizarUsuarioDto] = AtualizarUsuarioDto.create(req.body);
        
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new AtualizarUsuario(this.usuarioRepository)
            .execute(id, atualizarUsuarioDto!, tenantId, userId)
            .then(usuario => res.json(usuario))
            .catch(error => this.handleError(error, res));
    };

    alterarSenha = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, alterarSenhaDto] = AlterarSenhaDto.create(req.body);
        
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;

        new AlterarSenha(this.usuarioRepository)
            .execute(id, alterarSenhaDto!, tenantId)
            .then(sucesso => {
                if (sucesso) {
                    res.json({ message: 'Senha alterada com sucesso' });
                } else {
                    res.status(400).json({ error: 'Erro ao alterar senha' });
                }
            })
            .catch(error => this.handleError(error, res));
    };

    bloquearUsuario = (req: Request, res: Response) => {
        const { id } = req.params;
        const { tempo_minutos } = req.body;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.usuarioRepository.bloquearUsuario(id, tenantId, tempo_minutos)
            .then(sucesso => {
                if (sucesso) {
                    res.json({ message: 'Usuário bloqueado com sucesso' });
                } else {
                    res.status(400).json({ error: 'Erro ao bloquear usuário' });
                }
            })
            .catch(error => this.handleError(error, res));
    };

    desbloquearUsuario = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.usuarioRepository.desbloquearUsuario(id, tenantId)
            .then(sucesso => {
                if (sucesso) {
                    res.json({ message: 'Usuário desbloqueado com sucesso' });
                } else {
                    res.status(400).json({ error: 'Erro ao desbloquear usuário' });
                }
            })
            .catch(error => this.handleError(error, res));
    };

    deletarUsuario = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.usuarioRepository.deletar(id, tenantId)
            .then(deletado => {
                if (!deletado) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                res.json({ message: 'Usuário deletado com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    obterPerfilUsuario = (req: Request, res: Response) => {
        const userId = req.body.user?.id;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.usuarioRepository.buscarPorId(userId, tenantId)
            .then(usuario => {
                if (!usuario) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                res.json({
                    id: usuario.id,
                    nome: usuario.pessoa?.nome || usuario.usuario,
                    usuario: usuario.usuario,
                    papel: usuario.papel,
                    permissoes: usuario.permissoes,
                    unidades_acesso: usuario.unidades_acesso,
                    ultimo_acesso: usuario.ultimo_acesso
                });
            })
            .catch(error => this.handleError(error, res));
    };

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error('Erro usuario controller:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    };
}