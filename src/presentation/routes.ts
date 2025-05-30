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
import { EspecialidadeRoutes } from "./routes/especialidade.routes";
import { MedicamentoRoutes } from "./routes/medicamento.routes";

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

        // Gestão de Especialidades Médicas
        router.use('/api/especialidades', EspecialidadeRoutes.routes);

        // Gestão de Medicamentos
        router.use('/api/medicamentos', MedicamentoRoutes.routes);

        // ===================================
        // ROTA DE SAÚDE DA API
        // ===================================
        router.get('/api/health', (req, res) => {
            res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development',
                version: '1.0.0',
                endpoints: {
                    auth: '/api/auth',
                    tenants: '/api/tenants',
                    pessoas: '/api/pessoas',
                    pacientes: '/api/pacientes',
                    medicos: '/api/medicos',
                    usuarios: '/api/usuarios',
                    documentos: '/api/documentos',
                    unidades: '/api/unidades',
                    consultas: '/api/consultas',
                    agendamentos: '/api/agendamentos',
                    especialidades: '/api/especialidades',
                    medicamentos: '/api/medicamentos'
                }
            });
        });

        // ===================================
        // ROTA DE INFORMAÇÕES DO SISTEMA
        // ===================================
        router.get('/api/info', (req, res) => {
            res.json({
                name: 'Sistema de Gestão de Saúde',
                description: 'API completa para gestão de unidades de saúde',
                version: '1.0.0',
                features: [
                    'Multi-tenant (múltiplos municípios)',
                    'Gestão de Pacientes e Médicos',
                    'Agendamento de Consultas',
                    'Controle de Acesso por Permissões',
                    'Gestão de Documentos',
                    'Controle de Especialidades',
                    'Catálogo de Medicamentos',
                    'Histórico Médico Completo'
                ],
                modules: [
                    'UPA - Unidade de Pronto Atendimento',
                    'UBS - Unidade Básica de Saúde',
                    'Secretaria de Saúde',
                    'Clínicas Particulares',
                    'Laboratórios',
                    'Farmácias'
                ]
            });
        });

        // ===================================
        // ROTA 404 PARA APIs NÃO ENCONTRADAS
        // ===================================
        router.use(/(.*)/, (req, res) => {
            res.status(404).json({
                error: 'Endpoint não encontrado',
                path: req.path,
                method: req.method,
                available_endpoints: [
                    'GET /api/health - Status da API',
                    'GET /api/info - Informações do sistema',
                    'POST /api/auth/login - Login no sistema',
                    'POST /api/auth/register - Registro de usuário',
                    'GET /api/tenants - Gestão de municípios',
                    'GET /api/pessoas - Gestão de pessoas',
                    'GET /api/pacientes - Gestão de pacientes',
                    'GET /api/medicos - Gestão de médicos',
                    'GET /api/usuarios - Gestão de usuários',
                    'GET /api/documentos - Gestão de documentos',
                    'GET /api/unidades - Gestão de unidades',
                    'GET /api/consultas - Gestão de consultas',
                    'GET /api/agendamentos - Gestão de agendamentos',
                    'GET /api/especialidades - Gestão de especialidades',
                    'GET /api/medicamentos - Gestão de medicamentos'
                ]
            });
        });

        return router;
    }
}