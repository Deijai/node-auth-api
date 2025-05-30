// presentation/routes/consulta.routes.ts
import { Router } from "express";
import { ConsultaController } from "../controllers/consulta.controller";
import { ConsultaRepositoryImpl } from "../../infrastructure/repositories/consulta.repository.impl";
import { ConsultaDatasourceImpl } from "../../infrastructure/datasources/consulta.datasource.impl";
import { PacienteRepositoryImpl } from "../../infrastructure/repositories/paciente.repository.impl";
import { PacienteDatasourceImpl } from "../../infrastructure/datasources/paciente.datasource.impl";
import { MedicoRepositoryImpl } from "../../infrastructure/repositories/medico.repository.impl";
import { MedicoDatasourceImpl } from "../../infrastructure/datasources/medico.datasource.impl";
import { UnidadeRepositoryImpl } from "../../infrastructure/repositories/unidade.repository.impl";
import { UnidadeDatasourceImpl } from "../../infrastructure/datasources/unidade.datasource.impl";
import { PessoaRepositoryImpl } from "../../infrastructure/repositories/pessoa.repository.impl";
import { PessoaDatasourceImpl } from "../../infrastructure/datasources/pessoa.datasource.impl";
import { TenantMiddleware } from "../middlewares/tenant.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { PermissionMiddleware } from "../middlewares/permission.middleware";

export class ConsultaRoutes {
    static get routes(): Router {
        const router = Router();
        
        // Dependências
        const pessoaDatasource = new PessoaDatasourceImpl();
        const pessoaRepository = new PessoaRepositoryImpl(pessoaDatasource);
        
        const pacienteDatasource = new PacienteDatasourceImpl(pessoaRepository);
        const pacienteRepository = new PacienteRepositoryImpl(pacienteDatasource);
        
        const medicoDatasource = new MedicoDatasourceImpl(pessoaRepository);
        const medicoRepository = new MedicoRepositoryImpl(medicoDatasource);
        
        const unidadeDatasource = new UnidadeDatasourceImpl();
        const unidadeRepository = new UnidadeRepositoryImpl(unidadeDatasource);
        
        const consultaDatasource = new ConsultaDatasourceImpl();
        const consultaRepository = new ConsultaRepositoryImpl(consultaDatasource);
        
        const controller = new ConsultaController(
            consultaRepository, 
            pacienteRepository, 
            medicoRepository, 
            unidadeRepository
        );

        // Middlewares
        router.use(TenantMiddleware.validateTenant);
        router.use(AuthMiddleware.validateJWT);

        // Rotas
        router.post('/', 
            PermissionMiddleware.checkPermissions(['REALIZAR_ATENDIMENTO']),
            controller.criarConsulta
        );
        
        router.get('/', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE', 'REALIZAR_ATENDIMENTO']),
            controller.buscarConsultas
        );
        
        router.get('/estatisticas/:unidadeId', 
            PermissionMiddleware.checkPermissions(['GERAR_RELATORIOS']),
            controller.obterEstatisticas
        );
        
        router.get('/disponibilidade', 
            PermissionMiddleware.checkPermissions(['AGENDAR_CONSULTA']),
            controller.verificarDisponibilidade
        );
        
        router.get('/paciente/:pacienteId', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.buscarConsultasPorPaciente
        );
        
        router.get('/medico/:medicoId/agenda', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_AGENDA']),
            controller.buscarAgendaMedico
        );
        
        router.get('/unidade/:unidadeId/agenda', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_AGENDA']),
            controller.buscarAgendaUnidade
        );
        
        router.get('/:id', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.buscarConsultaPorId
        );
        
        router.put('/:id/iniciar', 
            PermissionMiddleware.checkPermissions(['REALIZAR_ATENDIMENTO']),
            controller.iniciarAtendimento
        );
        
        router.put('/:id/finalizar', 
            PermissionMiddleware.checkPermissions(['REALIZAR_ATENDIMENTO']),
            controller.finalizarConsulta
        );
        
        router.put('/:id/cancelar', 
            PermissionMiddleware.checkPermissions(['CANCELAR_CONSULTA']),
            controller.cancelarConsulta
        );
        
        router.put('/:id/nao-compareceu', 
            PermissionMiddleware.checkPermissions(['REALIZAR_ATENDIMENTO']),
            controller.marcarNaoCompareceu
        );

        return router;
    }
}