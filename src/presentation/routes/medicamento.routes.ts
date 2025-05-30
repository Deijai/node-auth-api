// presentation/routes/medicamento.routes.ts
import { Router } from "express";
import { MedicamentoController } from "../controllers/medicamento.controller";
import { MedicamentoRepositoryImpl } from "../../infrastructure/repositories/medicamento.repository.impl";
import { MedicamentoDatasourceImpl } from "../../infrastructure/datasources/medicamento.datasource.impl";
import { TenantMiddleware } from "../middlewares/tenant.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { PermissionMiddleware } from "../middlewares/permission.middleware";

export class MedicamentoRoutes {
    static get routes(): Router {
        const router = Router();
        
        // Dependências
        const medicamentoDatasource = new MedicamentoDatasourceImpl();
        const medicamentoRepository = new MedicamentoRepositoryImpl(medicamentoDatasource);
        const controller = new MedicamentoController(medicamentoRepository);

        // Middlewares
        router.use(TenantMiddleware.validateTenant);
        router.use(AuthMiddleware.validateJWT);

        // Rotas
        router.post('/', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_ESTOQUE', 'CONFIGURAR_SISTEMA']),
            controller.criarMedicamento
        );
        
        router.get('/', 
            PermissionMiddleware.checkPermissions(['PRESCREVER_MEDICAMENTO', 'GERENCIAR_ESTOQUE', 'VISUALIZAR_PACIENTE']),
            controller.buscarMedicamentos
        );
        
        router.get('/ativos', 
            PermissionMiddleware.checkPermissions(['PRESCREVER_MEDICAMENTO', 'GERENCIAR_ESTOQUE']),
            controller.buscarMedicamentosAtivos
        );
        
        router.get('/controlados', 
            PermissionMiddleware.checkPermissions(['PRESCREVER_MEDICAMENTO', 'GERENCIAR_ESTOQUE']),
            controller.buscarMedicamentosControlados
        );
        
        router.get('/sus', 
            PermissionMiddleware.checkPermissions(['PRESCREVER_MEDICAMENTO', 'GERENCIAR_ESTOQUE']),
            controller.buscarMedicamentosDisponivelSus
        );
        
        router.get('/codigo/:codigo', 
            PermissionMiddleware.checkPermissions(['PRESCREVER_MEDICAMENTO', 'GERENCIAR_ESTOQUE']),
            controller.buscarMedicamentoPorCodigoEan
        );
        
        router.get('/:id', 
            PermissionMiddleware.checkPermissions(['PRESCREVER_MEDICAMENTO', 'GERENCIAR_ESTOQUE']),
            controller.buscarMedicamentoPorId
        );
        
        router.put('/:id', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_ESTOQUE', 'CONFIGURAR_SISTEMA']),
            controller.atualizarMedicamento
        );
        
        router.put('/:id/ativar', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_ESTOQUE']),
            controller.ativarMedicamento
        );
        
        router.put('/:id/desativar', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_ESTOQUE']),
            controller.desativarMedicamento
        );
        
        router.delete('/:id', 
            PermissionMiddleware.checkPermissions(['CONFIGURAR_SISTEMA']),
            controller.deletarMedicamento
        );

        return router;
    }
}