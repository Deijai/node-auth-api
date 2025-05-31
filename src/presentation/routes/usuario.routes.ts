// ===================================
// CORREÇÃO CRÍTICA: ROTAS PÚBLICAS SEM TOKEN
// presentation/routes/usuario.routes.ts
// ===================================
import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller";
import { UsuarioRepositoryImpl } from "../../infrastructure/repositories/usuario.repository.impl";
import { UsuarioDatasourceImpl } from "../../infrastructure/datasources/usuario.datasource.impl";
import { PessoaRepositoryImpl } from "../../infrastructure/repositories/pessoa.repository.impl";
import { PessoaDatasourceImpl } from "../../infrastructure/datasources/pessoa.datasource.impl";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { TenantMiddleware } from "../middlewares/tenant.middleware";
import { PermissionMiddleware } from "../middlewares/permission.middleware";

export class UsuarioRoutes {
    static get routes(): Router {
        const router = Router();
        
        // Dependências
        const pessoaDatasource = new PessoaDatasourceImpl();
        const pessoaRepository = new PessoaRepositoryImpl(pessoaDatasource);
        
        const usuarioDatasource = new UsuarioDatasourceImpl();
        const usuarioRepository = new UsuarioRepositoryImpl(usuarioDatasource);
        
        const controller = new UsuarioController(usuarioRepository, pessoaRepository);

        // ===================================
        // MIDDLEWARE DE TENANT PARA TODAS AS ROTAS
        // ===================================
        router.use(TenantMiddleware.validateTenant);

        // ===================================
        // ROTAS PÚBLICAS (SEM AUTENTICAÇÃO)
        // ===================================
        
        // LOGIN - A ROTA MAIS IMPORTANTE! NÃO PODE PEDIR TOKEN!
        router.post('/login', controller.loginUsuario);
        
        // CRIAR PRIMEIRO USUÁRIO DO TENANT (SETUP INICIAL)
        router.post('/setup', controller.criarPrimeiroUsuario);
        
        // VERIFICAR STATUS DO TENANT (sem precisar de login)
        router.get('/tenant-status', (req, res) => {
            const tenant = req.body.tenant;
            res.json({
                tenant_id: tenant.id,
                nome: tenant.nome,
                status: tenant.status || 'ATIVO',
                configurado: !!tenant.configuracoes,
                tem_usuarios: true // Será implementado depois
            });
        });

        // ===================================
        // APLICAR AUTENTICAÇÃO PARA DEMAIS ROTAS
        // ===================================
        router.use(AuthMiddleware.validateJWT);

        // ===================================
        // ROTAS PROTEGIDAS (PRECISAM DE TOKEN)
        // ===================================
        
        // Criar usuário (apenas admins)
        router.post('/', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_USUARIOS']),
            controller.criarUsuario
        );
        
        // Listar usuários (apenas admins)
        router.get('/', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_USUARIOS']),
            controller.buscarUsuarios
        );
        
        // Perfil do próprio usuário logado
        router.get('/perfil', controller.obterPerfilUsuario);
        
        // Buscar usuário específico (apenas admins)
        router.get('/:id', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_USUARIOS']),
            controller.buscarUsuarioPorId
        );
        
        // Atualizar usuário (apenas admins)
        router.put('/:id', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_USUARIOS']),
            controller.atualizarUsuario
        );
        
        // Alterar própria senha (qualquer usuário logado)
        router.put('/:id/senha', controller.alterarSenha);
        
        // Bloquear usuário (apenas admins)
        router.put('/:id/bloquear', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_USUARIOS']),
            controller.bloquearUsuario
        );
        
        // Desbloquear usuário (apenas admins)
        router.put('/:id/desbloquear', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_USUARIOS']),
            controller.desbloquearUsuario
        );
        
        // Deletar usuário (apenas admins)
        router.delete('/:id', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_USUARIOS']),
            controller.deletarUsuario
        );

        // ===================================
        // ROTA DE LOGOUT (OPCIONAL)
        // ===================================
        router.post('/logout', (req, res) => {
            // Em JWT stateless, logout é apenas do lado cliente
            // Mas pode ser útil para logs de auditoria
            const userId = req.body.user?.id;
            console.log(`Usuário ${userId} fez logout`);
            
            res.json({ 
                message: 'Logout realizado com sucesso',
                timestamp: new Date().toISOString()
            });
        });

        return router;
    }
}