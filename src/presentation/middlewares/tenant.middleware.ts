// ===================================
// presentation/middlewares/tenant.middleware.ts
// ===================================
import { NextFunction, Request, Response } from "express";
import { TenantRepositoryImpl } from "../../infrastructure/repositories/tenant.repository.impl";
import { TenantDatasourceImpl } from "../../infrastructure/datasources/tenant.datasource.impl";

export class TenantMiddleware {
    static validateTenant = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            if (!req.body) req.body = {};

            // Obtém tenant ID do header ou subdomain
            const tenantId = req.header('X-Tenant-ID');
            const subdomain = req.header('X-Subdomain') || req.hostname.split('.')[0];

            if (!tenantId && !subdomain) {
                return res.status(400).json({ error: 'Tenant ID ou subdomínio é obrigatório' });
            }

            const tenantDatasource = new TenantDatasourceImpl();
            const tenantRepository = new TenantRepositoryImpl(tenantDatasource);

            let tenant;
            
            if (tenantId) {
                tenant = await tenantRepository.buscarPorId(tenantId);
            } else if (subdomain && subdomain !== 'localhost' && subdomain !== 'api') {
                tenant = await tenantRepository.buscarPorSubdomain(subdomain);
            }

            if (!tenant) {
                return res.status(404).json({ error: 'Tenant não encontrado' });
            }

            if (tenant.status !== 'ATIVO') {
                return res.status(403).json({ 
                    error: 'Tenant inativo', 
                    status: tenant.status 
                });
            }

            // Verificar se plano está ativo
            if (!tenant.planoAtivo()) {
                return res.status(403).json({ 
                    error: 'Plano inativo ou vencido' 
                });
            }

            // Adicionar tenant ao request
            req.body.tenant = {
                id: tenant.id,
                nome: tenant.nome,
                codigo: tenant.codigo,
                subdomain: tenant.subdomain,
                configuracoes: tenant.configuracoes,
                limites: tenant.limites,
                plano: tenant.plano
            };

            next();
        } catch (error) {
            console.error('Erro no middleware de tenant:', error);
            return res.status(500).json({ error: 'Erro interno no middleware de tenant' });
        }
    };
}