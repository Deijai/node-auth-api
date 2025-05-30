// ===================================
// CORREÇÃO DOS ERROS TYPESCRIPT - AUTH MIDDLEWARE
// presentation/middlewares/auth.middleware.ts
// ===================================
import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UsuarioModel } from "../../data/mongodb";

export class AuthMiddleware {
    static validateJWT = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const authorization = req.header('Authorization');

        if (!req.body) req.body = {};
        
        console.log('=== AUTH MIDDLEWARE DEBUG ===');
        console.log('Authorization header:', authorization);
        
        if (!authorization) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }
        
        if (!authorization.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Formato de token inválido' });
        }

        const token = authorization.split(' ').at(1) || '';
        console.log('Token extraído:', !!token);

        try {
            const payload = await JwtAdapter.validateJwt<{ 
                id: string, 
                tenant_id?: string, 
                papel?: string, 
                permissoes?: string[],
                usuario?: string
            }>(token);
            
            console.log('Payload JWT decodificado:', payload);
            
            if (!payload) {
                return res.status(401).json({ error: 'Token inválido' });
            }

            const tenantId = req.body.tenant?.id;
            console.log('Tenant ID do request:', tenantId);
            console.log('Tenant ID do payload:', payload.tenant_id);
            
            // BUSCAR USUÁRIO DO TENANT COM CAST CORRETO
            const tenantUser = await UsuarioModel.findOne({ 
                _id: payload.id, 
                tenant_id: tenantId 
            }).populate('pessoa_id') as any; // Cast para any para evitar erros de tipo

            console.log('Usuário encontrado:', tenantUser?.usuario);

            if (!tenantUser) {
                return res.status(401).json({ 
                    error: 'Usuário não encontrado',
                    debug: `Buscando ID: ${payload.id} no tenant: ${tenantId}`
                });
            }

            // VERIFICAR SE USUÁRIO ESTÁ ATIVO COM VERIFICAÇÃO SEGURA
            if (tenantUser.ativo === false) {
                return res.status(401).json({ error: 'Usuário inativo' });
            }

            // MONTAR OBJETO USER PADRONIZADO COM VERIFICAÇÕES SEGURAS
            const userComplete = {
                id: tenantUser._id?.toString() || tenantUser.id,
                usuario: tenantUser.usuario || 'usuario_sem_nome',
                nome: tenantUser.pessoa_id?.nome || tenantUser.usuario || 'Nome não informado',
                email: tenantUser.pessoa_id?.email || `${tenantUser.usuario}@tenant.local`,
                papel: tenantUser.papel || 'USER',
                permissoes: Array.isArray(tenantUser.permissoes) 
                    ? tenantUser.permissoes.flat() 
                    : (tenantUser.permissoes ? [tenantUser.permissoes] : []),
                tenant_id: tenantUser.tenant_id?.toString() || tenantId,
                unidades_acesso: tenantUser.unidades_acesso || [],
                ativo: tenantUser.ativo !== false, // Assume ativo se não especificado
                ultimo_acesso: tenantUser.ultimo_acesso || null,
                tipo_usuario: 'TENANT'
            };

            console.log('Usuário autenticado:', {
                id: userComplete.id,
                usuario: userComplete.usuario,
                papel: userComplete.papel,
                permissoes: userComplete.permissoes,
                tenant_id: userComplete.tenant_id
            });
            console.log('==============================');

            // ADICIONAR USER AO REQUEST
            req.body.user = userComplete;
            
            next();

        } catch (error) {
            console.error('Erro na validação JWT:', error);
            res.status(401).json({ 
                error: 'Token inválido',
                details: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // Método para desenvolvimento - BYPASS de autenticação
    static bypassAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if (!req.body) req.body = {};
        
        const tenantId = req.body.tenant?.id || 'dev-tenant-id';
        
        // Criar usuário fake para desenvolvimento
        req.body.user = {
            id: 'dev-user-id',
            usuario: 'dev-admin',
            nome: 'Desenvolvedor',
            email: 'dev@dev.com',
            papel: 'ADMIN',
            permissoes: ['ADMIN_SISTEMA', 'GERENCIAR_USUARIOS', 'CONFIGURAR_SISTEMA', 'GERAR_RELATORIOS'],
            tenant_id: tenantId,
            unidades_acesso: [],
            ativo: true,
            tipo_usuario: 'DEV'
        };

        console.log('🚫 BYPASS: Autenticação ignorada para desenvolvimento');
        console.log('User fake criado para tenant:', tenantId);
        next();
    }
}