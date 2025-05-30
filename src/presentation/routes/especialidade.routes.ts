// presentation/routes/especialidade.routes.ts
import { Router } from "express";
import { EspecialidadeController } from "../controllers/especialidade.controller";
import { EspecialidadeRepositoryImpl } from "../../infrastructure/repositories/especialidade.repository.impl";
import { EspecialidadeDatasourceImpl } from "../../infrastructure/datasources/especialidade.datasource.impl";
import { TenantMiddleware } from "../middlewares/tenant.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { PermissionMiddleware } from "../middlewares/permission.middleware";

export class EspecialidadeRoutes {
    static get routes(): Router {
        const router = Router();
        
        // Dependências
        const especialidadeDatasource = new EspecialidadeDatasourceImpl();
        const especialidadeRepository = new EspecialidadeRepositoryImpl(especialidadeDatasource);
        const controller = new EspecialidadeController(especialidadeRepository);

        // Middlewares
        router.use(TenantMiddleware.validateTenant);
        router.use(AuthMiddleware.validateJWT);

        // Rotas
        router.post('/', 
            PermissionMiddleware.checkPermissions(['CONFIGURAR_SISTEMA', 'GERENCIAR_UNIDADES']),
            controller.criarEspecialidade
        );
        
        router.get('/', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_MEDICO', 'AGENDAR_CONSULTA']),
            controller.buscarEspecialidades
        );
        
        router.get('/ativas', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_MEDICO', 'AGENDAR_CONSULTA']),
            controller.buscarEspecialidadesAtivas
        );
        
        router.get('/area/:area', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_MEDICO']),
            controller.buscarEspecialidadesPorArea
        );
        
        router.get('/codigo/:codigo', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_MEDICO']),
            controller.buscarEspecialidadePorCodigo
        );
        
        router.get('/:id', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_MEDICO']),
            controller.buscarEspecialidadePorId
        );
        
        router.put('/:id', 
            PermissionMiddleware.checkPermissions(['CONFIGURAR_SISTEMA', 'GERENCIAR_UNIDADES']),
            controller.atualizarEspecialidade
        );
        
        router.put('/:id/ativar', 
            PermissionMiddleware.checkPermissions(['CONFIGURAR_SISTEMA']),
            controller.ativarEspecialidade
        );
        
        router.put('/:id/desativar', 
            PermissionMiddleware.checkPermissions(['CONFIGURAR_SISTEMA']),
            controller.desativarEspecialidade
        );
        
        router.delete('/:id', 
            PermissionMiddleware.checkPermissions(['CONFIGURAR_SISTEMA']),
            controller.deletarEspecialidade
        );

        return router;
    }
}