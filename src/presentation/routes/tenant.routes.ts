// presentation/routes/tenant.routes.ts
import { Router } from "express";
import { TenantController } from "../controllers/tenant.controller";
import { TenantRepositoryImpl } from "../../infrastructure/repositories/tenant.repository.impl";
import { TenantDatasourceImpl } from "../../infrastructure/datasources/tenant.datasource.impl";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { PermissionMiddleware } from "../middlewares/permission.middleware";

export class TenantRoutes {
    static get routes(): Router {
        const router = Router();
        
        // Dependências
        const tenantDatasource = new TenantDatasourceImpl();
        const tenantRepository = new TenantRepositoryImpl(tenantDatasource);
        const controller = new TenantController(tenantRepository);

        // Rotas públicas (sem autenticação)
        router.get('/verificar/:subdomain', controller.verificarDisponibilidadeSubdomain);
        router.get('/configuracoes/:subdomain', controller.obterConfiguracoesTenant);

        // Aplicar autenticação para as demais rotas
        //router.use(AuthMiddleware.validateJWT);

        // Rotas administrativas (super admin)
        router.post('/', 
            PermissionMiddleware.checkPermissions(['ADMIN_SISTEMA']), // Super admin apenas
            controller.criarTenant
        );
        
        router.get('/', 
            //PermissionMiddleware.checkPermissions(['ADMIN_SISTEMA']),
            controller.buscarTenants
        );
        
        router.get('/:id', 
            //PermissionMiddleware.checkPermissions(['ADMIN_SISTEMA', 'VISUALIZAR_TENANT']),
            controller.buscarTenantPorId
        );
        
        router.get('/subdomain/:subdomain', 
            //PermissionMiddleware.checkPermissions(['ADMIN_SISTEMA']),
            controller.buscarTenantPorSubdomain
        );
        
        router.put('/:id', 
            PermissionMiddleware.checkPermissions(['ADMIN_SISTEMA', 'EDITAR_TENANT']),
            controller.atualizarTenant
        );
        
        router.put('/:id/configurar', 
            PermissionMiddleware.checkPermissions(['CONFIGURAR_SISTEMA']),
            controller.configurarTenant
        );
        
        router.put('/:id/plano', 
            PermissionMiddleware.checkPermissions(['ADMIN_SISTEMA']),
            controller.atualizarPlano
        );
        
        router.get('/:id/estatisticas', 
            PermissionMiddleware.checkPermissions(['GERAR_RELATORIOS', 'ADMIN_SISTEMA']),
            controller.obterEstatisticas
        );
        
        router.get('/:id/limites', 
            PermissionMiddleware.checkPermissions(['GERAR_RELATORIOS', 'ADMIN_SISTEMA']),
            controller.verificarLimites
        );
        
        router.put('/:id/suspender', 
            PermissionMiddleware.checkPermissions(['ADMIN_SISTEMA']),
            controller.suspenderTenant
        );
        
        router.put('/:id/reativar', 
            PermissionMiddleware.checkPermissions(['ADMIN_SISTEMA']),
            controller.reativarTenant
        );
        
        router.delete('/:id', 
            PermissionMiddleware.checkPermissions(['ADMIN_SISTEMA']),
            controller.deletarTenant
        );

        return router;
    }
}