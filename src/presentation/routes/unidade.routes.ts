// presentation/routes/unidade.routes.ts
import { Router } from "express";
import { UnidadeController } from "../controllers/unidade.controller";
import { UnidadeDatasourceImpl } from "../../infrastructure/datasources/unidade.datasource.impl";
import { UsuarioRepositoryImpl } from "../../infrastructure/repositories/usuario.repository.impl";
import { UsuarioDatasourceImpl } from "../../infrastructure/datasources/usuario.datasource.impl";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { UnidadeRepositoryImpl } from "../../infrastructure/repositories/unidade.repository.impl";
import { PermissionMiddleware } from "../middlewares/permission.middleware";
import { TenantMiddleware } from "../middlewares/tenant.middleware";

export class UnidadeRoutes {
    static get routes(): Router {
        const router = Router();
        
        // Dependências
        const usuarioDatasource = new UsuarioDatasourceImpl();
        const usuarioRepository = new UsuarioRepositoryImpl(usuarioDatasource);
        
        const unidadeDatasource = new UnidadeDatasourceImpl();
        const unidadeRepository = new UnidadeRepositoryImpl(unidadeDatasource);
        
        const controller = new UnidadeController(unidadeRepository, usuarioRepository);

        // Middlewares
        router.use(TenantMiddleware.validateTenant);
        router.use(AuthMiddleware.validateJWT);

        // Rotas
        router.post('/', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_UNIDADES']),
            controller.criarUnidade
        );
        
        router.get('/', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE', 'VISUALIZAR_MEDICO']),
            controller.buscarUnidades
        );
        
        router.get('/proximas', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.buscarUnidadesProximas
        );
        
        router.get('/tipo/:tipo', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.buscarUnidadesPorTipo
        );
        
        router.get('/especialidade/:especialidade', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.buscarUnidadesPorEspecialidade
        );
        
        router.get('/:id', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.buscarUnidadePorId
        );
        
        router.get('/:id/estatisticas', 
            PermissionMiddleware.checkPermissions(['GERAR_RELATORIOS']),
            controller.obterEstatisticasUnidade
        );
        
        router.put('/:id', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_UNIDADES']),
            controller.atualizarUnidade
        );
        
        router.delete('/:id', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_UNIDADES']),
            controller.deletarUnidade
        );

        return router;
    }
}