// presentation/routes/agendamento.routes.ts
import { Router } from "express";
import { AgendamentoController } from "../controllers/agendamento.controller";
import { AgendamentoRepositoryImpl } from "../../infrastructure/repositories/agendamento.repository.impl";
import { AgendamentoDatasourceImpl } from "../../infrastructure/datasources/agendamento.datasource.impl";
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

export class AgendamentoRoutes {
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
        
        const agendamentoDatasource = new AgendamentoDatasourceImpl();
        const agendamentoRepository = new AgendamentoRepositoryImpl(agendamentoDatasource);
        
        const controller = new AgendamentoController(
            agendamentoRepository, 
            pacienteRepository, 
            medicoRepository, 
            unidadeRepository
        );

        // Middlewares
        router.use(TenantMiddleware.validateTenant);
        router.use(AuthMiddleware.validateJWT);

        // Rotas
        router.post('/', 
            PermissionMiddleware.checkPermissions(['AGENDAR_CONSULTA']),
            controller.criarAgendamento
        );
        
        router.get('/', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_AGENDA']),
            controller.buscarAgendamentos
        );
        
        router.get('/lembretes', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_AGENDA']),
            controller.buscarProximosLembretes
        );
        
        router.get('/paciente/:pacienteId', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.buscarAgendamentosPorPaciente
        );
        
        router.get('/medico/:medicoId/agenda', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_AGENDA']),
            controller.buscarAgendaDia
        );
        
        router.get('/medico/:medicoId/horarios-disponiveis', 
            PermissionMiddleware.checkPermissions(['AGENDAR_CONSULTA']),
            controller.obterHorariosDisponiveis
        );
        
        router.get('/:id', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_AGENDA']),
            controller.buscarAgendamentoPorId
        );
        
        router.put('/:id', 
            PermissionMiddleware.checkPermissions(['AGENDAR_CONSULTA']),
            controller.atualizarAgendamento
        );
        
        router.put('/:id/confirmar', 
            PermissionMiddleware.checkPermissions(['AGENDAR_CONSULTA']),
            controller.confirmarAgendamento
        );
        
        router.put('/:id/cancelar', 
            PermissionMiddleware.checkPermissions(['CANCELAR_CONSULTA']),
            controller.cancelarAgendamento
        );
        
        router.put('/:id/reagendar', 
            PermissionMiddleware.checkPermissions(['AGENDAR_CONSULTA']),
            controller.reagendarAgendamento
        );
        
        router.put('/:id/realizado', 
            PermissionMiddleware.checkPermissions(['REALIZAR_ATENDIMENTO']),
            controller.marcarRealizado
        );

        return router;
    }
}