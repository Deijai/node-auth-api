// domain/use-cases/usuario/login-usuario.use-case.ts
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { LoginUsuarioDto } from '../../dtos/usuario/login-usuario.dto';
import { LoginResult } from '../../datasources/usuario.datasource';
import { CustomError } from '../../errors/custom.error';
import { JwtAdapter } from '../../../config';

interface LoginUsuarioUseCase {
    execute(loginUsuarioDto: LoginUsuarioDto, tenantId: string): Promise<LoginResult>;
}

export class LoginUsuario implements LoginUsuarioUseCase {
    constructor(
        private readonly usuarioRepository: UsuarioRepository,
        private readonly signToken: (payload: Object, duration?: number) => Promise<string | null> = JwtAdapter.generateToken
    ) {}

    async execute(loginUsuarioDto: LoginUsuarioDto, tenantId: string): Promise<LoginResult> {
        try {
            // Fazer login
            const usuario = await this.usuarioRepository.login(loginUsuarioDto, tenantId);

            // Verificar se usuário está ativo
            if (!usuario.ativo) {
                throw CustomError.unauthorized('Usuário inativo');
            }

            // Verificar se está bloqueado
            if (usuario.estaBloqueado()) {
                throw CustomError.unauthorized('Usuário temporariamente bloqueado');
            }

            // Registrar acesso
            await this.usuarioRepository.registrarAcesso(usuario.id, tenantId);

            // Resetar tentativas de login
            await this.usuarioRepository.resetarTentativasLogin(usuario.id, tenantId);

            // Gerar token
            const token = await this.signToken({
                id: usuario.id,
                tenant_id: tenantId,
                papel: usuario.papel,
                permissoes: usuario.permissoes
            }, 60 * 60 * 8); // 8 horas

            if (!token) {
                throw CustomError.internalServerError('Erro ao gerar token');
            }

            return {
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.pessoa?.nome || usuario.usuario,
                    usuario: usuario.usuario,
                    papel: usuario.papel,
                    permissoes: usuario.permissoes || [],
                    tenant_id: tenantId
                }
            };
        } catch (error) {
            if (error instanceof CustomError) {
                // Incrementar tentativas de login em caso de erro
                if (error.statusCode === 401) {
                    try {
                        const usuario = await this.usuarioRepository.buscarPorUsuario(loginUsuarioDto.usuario, tenantId);
                        if (usuario) {
                            const tentativas = await this.usuarioRepository.incrementarTentativasLogin(usuario.id, tenantId);
                            
                            // Bloquear após 5 tentativas por 30 minutos
                            if (tentativas >= 5) {
                                await this.usuarioRepository.bloquearUsuario(usuario.id, tenantId, 30);
                                throw CustomError.unauthorized('Usuário bloqueado por excesso de tentativas');
                            }
                        }
                    } catch (incrementError) {
                        // Não fazer nada se falhar ao incrementar
                    }
                }
                throw error;
            }
            throw CustomError.internalServerError('Erro interno no login');
        }
    }
}