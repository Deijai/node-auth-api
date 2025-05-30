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
            console.log('=== LOGIN USE CASE ===');
            console.log('Login DTO:', loginUsuarioDto);
            console.log('Tenant ID:', tenantId);

            // Fazer login
            const usuario = await this.usuarioRepository.login(loginUsuarioDto, tenantId);
            console.log('Usuário encontrado:', usuario.usuario);

            // Verificar se usuário está ativo
            if (!usuario.ativo) {
                throw CustomError.unauthorized('Usuário inativo');
            }

            // Verificar se está bloqueado
            if (usuario.estaBloqueado()) {
                throw CustomError.unauthorized('Usuário temporariamente bloqueado');
            }

            // CRIAR PAYLOAD COMPLETO COM TODAS AS INFORMAÇÕES
            const payload = {
                id: usuario.id,
                tenant_id: tenantId,
                papel: usuario.papel,
                permissoes: usuario.permissoes || [],
                usuario: usuario.usuario
            };

            console.log('Payload para JWT:', payload);

            // Gerar token
            const token = await this.signToken(payload, 60 * 60 * 8); // 8 horas

            if (!token) {
                throw CustomError.internalServerError('Erro ao gerar token');
            }

            // Registrar acesso e resetar tentativas
            await this.usuarioRepository.registrarAcesso(usuario.id, tenantId);
            await this.usuarioRepository.resetarTentativasLogin(usuario.id, tenantId);

            const result: LoginResult = {
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

            console.log('Resultado final:', result);
            console.log('===================');
            
            return result;

        } catch (error) {
            console.error('Erro no login use case:', error);
            // ... resto do tratamento de erro ...
            throw error;
        }
    }
}