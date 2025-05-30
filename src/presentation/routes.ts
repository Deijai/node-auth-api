// presentation/routes.ts
import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { PessoaRoutes } from "./routes/pessoa.routes";
import { PacienteRoutes } from "./routes/paciente.routes";
import { MedicoRoutes } from "./routes/medico.routes";
import { UsuarioRoutes } from "./routes/usuario.routes";
import { DocumentoRoutes } from "./routes/documento.routes";
import { UnidadeRoutes } from "./routes/unidade.routes";
import { ConsultaRoutes } from "./routes/consulta.routes";
import { AgendamentoRoutes } from "./routes/agendamento.routes";
import { TenantRoutes } from "./routes/tenant.routes";

export class AppRoutes {
    public constructor() {}

    static get routes(): Router {
        const router = Router();

        // ===================================
        // ROTAS PRINCIPAIS DO SISTEMA
        // ===================================

        // Autenticação (sem tenant - usado para login inicial)
        router.use('/api/auth', AuthRoutes.routes);

        // Gestão de Tenants (super admin apenas)
        router.use('/api/tenants', TenantRoutes.routes);

        // ===================================
        // ROTAS COM VALIDAÇÃO DE TENANT
        // ===================================

        // Gestão de Pessoas (base para pacientes, médicos, usuários)
        router.use('/api/pessoas', PessoaRoutes.routes);

        // Gestão de Pacientes
        router.use('/api/pacientes', PacienteRoutes.routes);

        // Gestão de Médicos
        router.use('/api/medicos', MedicoRoutes.routes);

        // Gestão de Usuários do Sistema
        router.use('/api/usuarios', UsuarioRoutes.routes);

        // Gestão de Documentos
        router.use('/api/documentos', DocumentoRoutes.routes);

        // Gestão de Unidades de Saúde
        router.use('/api/unidades', UnidadeRoutes.routes);

        // Gestão de Consultas/Atendimentos
        router.use('/api/consultas', ConsultaRoutes.routes);

        // Gestão de Agendamentos
        router.use('/api/agendamentos', AgendamentoRoutes.routes);

        // ===================================
        // ROTA DE SAÚDE DA API
        // ===================================
        router.get('/api/health', (req, res) => {
            res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development',
                version: '1.0.0'
            });
        });

        // ===================================
        // ROTA 404 PARA APIs NÃO ENCONTRADAS
        // ===================================
        router.use('/api/*', (req, res) => {
            res.status(404).json({
                error: 'Endpoint não encontrado',
                path: req.path,
                method: req.method,
                available_endpoints: [
                    'GET /api/health',
                    'POST /api/auth/login',
                    'POST /api/auth/register',
                    'GET /api/pessoas',
                    'GET /api/pacientes',
                    'GET /api/medicos',
                    'GET /api/usuarios',
                    'GET /api/documentos',
                    'GET /api/unidades',
                    'GET /api/consultas',
                    'GET /api/agendamentos',
                    'GET /api/tenants'
                ]
            });
        });

        return router;
    }
}