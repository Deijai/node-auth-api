// ===================================
// presentation/middlewares/permission.middleware.ts
// ===================================
import { NextFunction, Request, Response } from "express";

export class PermissionMiddleware {
    static checkPermissions = (permissoesRequeridas: string[]) => {
        return (req: Request, res: Response, next: NextFunction): any => {
            try {
                // CORREÇÃO: Acessar o user corretamente
                const user = req.body.user; // Era req.body, agora é req.body.user
                
                console.log('=== PERMISSION MIDDLEWARE ===');
                console.log('Permissões requeridas:', permissoesRequeridas);
                console.log('User do request:', {
                    id: user?.id,
                    usuario: user?.usuario,
                    papel: user?.papel,
                    permissoes: user?.permissoes
                });

                if (!user) {
                    return res.status(401).json({ error: 'Usuário não autenticado' });
                }

                // Super admin tem todas as permissões
                if (user.papel === 'ADMIN' && user.permissoes?.includes('ADMIN_SISTEMA')) {
                    console.log('✅ ADMIN_SISTEMA - Acesso liberado');
                    return next();
                }

                // Verificar se usuário tem pelo menos uma das permissões requeridas
                const temPermissao = permissoesRequeridas.some(permissao => 
                    user.permissoes?.includes(permissao)
                );

                console.log('Tem permissão:', temPermissao);
                console.log('=============================');

                if (!temPermissao) {
                    return res.status(403).json({ 
                        error: 'Permissão insuficiente',
                        permissoes_requeridas: permissoesRequeridas,
                        permissoes_usuario: user.permissoes || [],
                        debug: {
                            user_id: user.id,
                            papel: user.papel,
                            permissoes_disponiveis: user.permissoes
                        }
                    });
                }

                // Verificar acesso à unidade (se aplicável)
                const unidadeId = req.params.unidadeId || req.body.unidade_id || req.query.unidade_id;
                if (unidadeId && user.unidades_acesso && user.unidades_acesso.length > 0) {
                    if (!user.unidades_acesso.includes(unidadeId)) {
                        return res.status(403).json({ 
                            error: 'Acesso negado a esta unidade',
                            unidade_solicitada: unidadeId,
                            unidades_permitidas: user.unidades_acesso
                        });
                    }
                }

                next();
            } catch (error) {
                console.error('Erro no middleware de permissão:', error);
                return res.status(500).json({ 
                    error: 'Erro interno no middleware de permissão',
                    details: error instanceof Error ? error.message : 'Erro desconhecido'
                });
            }
        };
    };

    // Middleware para verificar se usuário pode acessar dados de outro usuário
    static checkUserAccess = (req: Request, res: Response, next: NextFunction): any => {
        try {
            const user = req.body.user;
            const targetUserId = req.params.id || req.params.userId;

            if (!user) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }

            // Super admin pode acessar qualquer usuário
            if (user.papel === 'ADMIN' && user.permissoes?.includes('ADMIN_SISTEMA')) {
                return next();
            }

            // Usuário pode acessar apenas seus próprios dados
            if (user.id !== targetUserId) {
                return res.status(403).json({ 
                    error: 'Acesso negado aos dados deste usuário',
                    user_id: user.id,
                    target_user_id: targetUserId
                });
            }

            next();
        } catch (error) {
            console.error('Erro no middleware de acesso de usuário:', error);
            return res.status(500).json({ error: 'Erro interno no middleware' });
        }
    };

    // Middleware para verificar se usuário pode acessar dados de um paciente
    static checkPatientAccess = (req: Request, res: Response, next: NextFunction): any => {
        try {
            const user = req.body.user;
            const tenant = req.body.tenant;

            if (!user) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }

            if (!tenant) {
                return res.status(400).json({ error: 'Tenant não identificado' });
            }

            // Verificar se usuário tem acesso no tenant
            if (user.tenant_id !== tenant.id) {
                return res.status(403).json({ 
                    error: 'Acesso negado neste município',
                    user_tenant: user.tenant_id,
                    request_tenant: tenant.id
                });
            }

            // Médicos e enfermeiros podem acessar apenas pacientes de suas unidades
            if (['MEDICO', 'ENFERMEIRO'].includes(user.papel)) {
                // Verificação mais específica baseada na unidade
                const unidadeId = req.params.unidadeId || req.body.unidade_id;
                if (unidadeId && user.unidades_acesso && user.unidades_acesso.length > 0) {
                    if (!user.unidades_acesso.includes(unidadeId)) {
                        return res.status(403).json({ 
                            error: 'Acesso negado a pacientes desta unidade' 
                        });
                    }
                }
            }

            next();
        } catch (error) {
            console.error('Erro no middleware de acesso de paciente:', error);
            return res.status(500).json({ error: 'Erro interno no middleware' });
        }
    };
}