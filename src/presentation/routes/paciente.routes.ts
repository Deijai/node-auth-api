// presentation/routes/paciente.routes.ts
import { Router } from "express";
import { PacienteController } from "../controllers/paciente.controller";
import { PacienteRepositoryImpl } from "../../infrastructure/repositories/paciente.repository.impl";
import { PacienteDatasourceImpl } from "../../infrastructure/datasources/paciente.datasource.impl";
import { PessoaRepositoryImpl } from "../../infrastructure/repositories/pessoa.repository.impl";
import { PessoaDatasourceImpl } from "../../infrastructure/datasources/pessoa.datasource.impl";
import { TenantMiddleware } from "../middlewares/tenant.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { PermissionMiddleware } from "../middlewares/permission.middleware";

export class PacienteRoutes {
    static get routes(): Router {
        const router = Router();
        
        // Dependências
        const pessoaDatasource = new PessoaDatasourceImpl();
        const pessoaRepository = new PessoaRepositoryImpl(pessoaDatasource);
        
        const pacienteDatasource = new PacienteDatasourceImpl(pessoaRepository);
        const pacienteRepository = new PacienteRepositoryImpl(pacienteDatasource);
        
        const controller = new PacienteController(pacienteRepository, pessoaRepository);

        // Middlewares
        router.use(TenantMiddleware.validateTenant);
        router.use(AuthMiddleware.validateJWT);

        // Rotas
        router.post('/', 
            PermissionMiddleware.checkPermissions(['CADASTRAR_PACIENTE']),
            controller.criarPaciente
        );
        
        router.post('/completo', 
            PermissionMiddleware.checkPermissions(['CADASTRAR_PACIENTE']),
            controller.criarPacienteCompleto
        );
        
        router.get('/', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.buscarPacientes
        );
        
        router.get('/:id', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.buscarPacientePorId
        );
        
        router.get('/cpf/:cpf', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.buscarPacientePorCpf
        );
        
        router.get('/cartao-sus/:cartao', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.buscarPacientePorCartaoSus
        );
        
        router.get('/:id/historico', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.obterHistoricoMedico
        );
        
        router.put('/:id', 
            PermissionMiddleware.checkPermissions(['EDITAR_PACIENTE']),
            controller.atualizarPaciente
        );
        
        router.delete('/:id', 
            PermissionMiddleware.checkPermissions(['DELETAR_PACIENTE']),
            controller.deletarPaciente
        );

        return router;
    }
}
