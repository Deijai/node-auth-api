
// presentation/controllers/tenant.controller.ts
import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { AtualizarTenantDto } from '../../domain/dtos/tenant/atualizar-tenant.dto';
import { BuscarTenantDto } from '../../domain/dtos/tenant/buscar-tenant.dto';
import { ConfigurarTenantDto } from '../../domain/dtos/tenant/configurar-tenant.dto';
import { CriarTenantDto } from '../../domain/dtos/tenant/criar-tenant.dto';
import { TenantRepository } from '../../domain/repositories/tenant.repository';
import { ConfigurarTenant } from '../../domain/use-cases/tenant/configurar-tenant.use-case';
import { CriarTenant } from '../../domain/use-cases/tenant/criar-tenant.use-case';
import { VerificarLimites } from '../../domain/use-cases/tenant/verificar-limites.use-case';

export class TenantController {
    constructor(private readonly tenantRepository: TenantRepository) {}

    criarTenant = (req: Request, res: Response): void => {
        const [error, criarTenantDto] = CriarTenantDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const userId = req.body.user?.id || req.body.userId || 'system';

        new CriarTenant(this.tenantRepository)
            .execute(criarTenantDto!, userId)
            .then(tenant => res.status(201).json(tenant))
            .catch(error => this.handleError(error, res));
    };

    buscarTenants = (req: Request, res: Response): void => {
        const [error, buscarTenantDto] = BuscarTenantDto.create(req.query);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        this.tenantRepository.buscar(buscarTenantDto!)
            .then(resultado => res.json(resultado))
            .catch(error => this.handleError(error, res));
    };

    buscarTenantPorId = (req: Request, res: Response): void => {
        const { id } = req.params;

        this.tenantRepository.buscarPorId(id)
            .then(tenant => {
                if (!tenant) {
                    res.status(404).json({ error: 'Tenant não encontrado' });
                    return;
                }
                res.json(tenant);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarTenantPorSubdomain = (req: Request, res: Response): void => {
        const { subdomain } = req.params;

        this.tenantRepository.buscarPorSubdomain(subdomain)
            .then(tenant => {
                if (!tenant) {
                    res.status(404).json({ error: 'Tenant não encontrado' });
                    return;
                }
                res.json(tenant);
            })
            .catch(error => this.handleError(error, res));
    };

    atualizarTenant = (req: Request, res: Response): void => {
        const { id } = req.params;
        const [error, atualizarTenantDto] = AtualizarTenantDto.create(req.body);
        
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const userId = req.body.user?.id || req.body.userId || 'system';

        this.tenantRepository.atualizar(id, atualizarTenantDto!, userId)
            .then(tenant => res.json(tenant))
            .catch(error => this.handleError(error, res));
    };

    configurarTenant = (req: Request, res: Response): void => {
        const { id } = req.params;
        const [error, configurarTenantDto] = ConfigurarTenantDto.create(req.body);
        
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const userId = req.body.user?.id || req.body.userId;

        new ConfigurarTenant(this.tenantRepository)
            .execute(id, configurarTenantDto!, userId)
            .then(tenant => res.json(tenant))
            .catch(error => this.handleError(error, res));
    };

    atualizarPlano = (req: Request, res: Response): void => {
        const { id } = req.params;
        const { plano } = req.body;
        const userId = req.body.user?.id || req.body.userId || 'system';

        if (!plano) {
            res.status(400).json({ error: 'Dados do plano são obrigatórios' });
            return;
        }

        this.tenantRepository.atualizarPlano(id, plano, userId)
            .then(tenant => res.json(tenant))
            .catch(error => this.handleError(error, res));
    };

    obterEstatisticas = (req: Request, res: Response): void => {
        const { id } = req.params;

        this.tenantRepository.obterEstatisticas(id)
            .then(estatisticas => res.json(estatisticas))
            .catch(error => this.handleError(error, res));
    };

    verificarLimites = (req: Request, res: Response): void => {
        const { id } = req.params;

        new VerificarLimites(this.tenantRepository)
            .execute(id)
            .then(limites => res.json(limites))
            .catch(error => this.handleError(error, res));
    };

    suspenderTenant = (req: Request, res: Response): void => {
        const { id } = req.params;
        const { motivo } = req.body;
        const userId = req.body.user?.id || req.body.userId || 'system';

        if (!motivo) {
            res.status(400).json({ error: 'Motivo da suspensão é obrigatório' });
            return;
        }

        this.tenantRepository.suspender(id, motivo, userId)
            .then(suspenso => {
                if (!suspenso) {
                    res.status(404).json({ error: 'Tenant não encontrado' });
                    return;
                }
                res.json({ message: 'Tenant suspenso com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    reativarTenant = (req: Request, res: Response): void => {
        const { id } = req.params;
        const userId = req.body.user?.id || req.body.userId || 'system';

        this.tenantRepository.reativar(id, userId)
            .then(reativado => {
                if (!reativado) {
                    res.status(404).json({ error: 'Tenant não encontrado' });
                    return;
                }
                res.json({ message: 'Tenant reativado com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    deletarTenant = (req: Request, res: Response): void => {
        const { id } = req.params;

        this.tenantRepository.deletar(id)
            .then(deletado => {
                if (!deletado) {
                    res.status(404).json({ error: 'Tenant não encontrado' });
                    return;
                }
                res.json({ message: 'Tenant deletado com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    obterConfiguracoesTenant = (req: Request, res: Response): void => {
        const tenantId = req.body.tenant?.id || req.params.id;

        this.tenantRepository.buscarPorId(tenantId)
            .then(tenant => {
                if (!tenant) {
                    res.status(404).json({ error: 'Tenant não encontrado' });
                    return;
                }
                
                // Retornar apenas configurações públicas (sem dados sensíveis)
                res.json({
                    nome: tenant.nome,
                    subdomain: tenant.subdomain,
                    configuracoes: {
                        timezone: tenant.configuracoes?.timezone,
                        logo_url: tenant.configuracoes?.logo_url,
                        favicon_url: tenant.configuracoes?.favicon_url,
                        cores_tema: tenant.configuracoes?.cores_tema,
                        modulos_ativos: tenant.configuracoes?.modulos_ativos,
                        configuracoes_sistema: tenant.configuracoes?.configuracoes_sistema,
                        configuracoes_clinicas: tenant.configuracoes?.configuracoes_clinicas
                    },
                    plano: {
                        tipo: tenant.plano?.tipo,
                        status: tenant.plano?.status
                    }
                });
            })
            .catch(error => this.handleError(error, res));
    };

    verificarDisponibilidadeSubdomain = (req: Request, res: Response): void => {
        const { subdomain } = req.params;

        this.tenantRepository.buscarPorSubdomain(subdomain)
            .then(tenant => {
                res.json({ 
                    disponivel: !tenant,
                    subdomain 
                });
            })
            .catch(error => this.handleError(error, res));
    };

    private handleError = (error: unknown, res: Response): void => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        console.error('Erro tenant controller:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    };
}
