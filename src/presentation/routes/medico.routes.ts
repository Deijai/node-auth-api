// presentation/routes/medico.routes.ts
import { Router } from "express";
import { MedicoController } from "../controllers/medico.controller";
import { MedicoRepositoryImpl } from "../../infrastructure/repositories/medico.repository.impl";
import { MedicoDatasourceImpl } from "../../infrastructure/datasources/medico.datasource.impl";
import { PessoaRepositoryImpl } from "../../infrastructure/repositories/pessoa.repository.impl";
import { PessoaDatasourceImpl } from "../../infrastructure/datasources/pessoa.datasource.impl";
import { TenantMiddleware } from "../middlewares/tenant.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { PermissionMiddleware } from "../middlewares/permission.middleware";

export class MedicoRoutes {
    static get routes(): Router {
        const router = Router();
        
        // Dependências
        const pessoaDatasource = new PessoaDatasourceImpl();
        const pessoaRepository = new PessoaRepositoryImpl(pessoaDatasource);
        
        const medicoDatasource = new MedicoDatasourceImpl(pessoaRepository);
        const medicoRepository = new MedicoRepositoryImpl(medicoDatasource);
        
        const controller = new MedicoController(medicoRepository, pessoaRepository);

        // Middlewares
        router.use(TenantMiddleware.validateTenant);
        router.use(AuthMiddleware.validateJWT);

        // Rotas
        router.post('/', 
            PermissionMiddleware.checkPermissions(['CADASTRAR_MEDICO']),
            controller.criarMedico
        );
        
        router.post('/completo', 
            PermissionMiddleware.checkPermissions(['CADASTRAR_MEDICO']),
            controller.criarMedicoCompleto
        );
        
        router.get('/', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_MEDICO']),
            controller.buscarMedicos
        );
        
        router.get('/unidade/:unidadeId', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_MEDICO']),
            controller.buscarMedicosPorUnidade
        );
        
        router.get('/especialidade/:especialidade', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_MEDICO']),
            controller.buscarMedicosPorEspecialidade
        );
        
        router.get('/:id', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_MEDICO']),
            controller.buscarMedicoPorId
        );
        
        router.get('/crm/:crm', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_MEDICO']),
            controller.buscarMedicoPorCrm
        );
        
        router.get('/:id/agenda', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_AGENDA']),
            controller.obterAgendaMedico
        );
        
        router.get('/:id/estatisticas', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_MEDICO']),
            controller.obterEstatisticasMedico
        );
        
        router.put('/:id', 
            PermissionMiddleware.checkPermissions(['EDITAR_MEDICO']),
            controller.atualizarMedico
        );
        
        router.delete('/:id', 
            PermissionMiddleware.checkPermissions(['DELETAR_MEDICO']),
            controller.deletarMedico
        );

        return router;
    }
}