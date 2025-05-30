// domain/use-cases/tenant/configurar-tenant.use-case.ts
import { TenantRepository } from '../../repositories/tenant.repository';
import { ConfigurarTenantDto } from '../../dtos/tenant/configurar-tenant.dto';
import { TenantEntity } from '../../entities/tenant.entity';
import { CustomError } from '../../errors/custom.error';

interface ConfigurarTenantUseCase {
    execute(tenantId: string, configurarTenantDto: ConfigurarTenantDto, userId: string): Promise<TenantEntity>;
}

export class ConfigurarTenant implements ConfigurarTenantUseCase {
    constructor(private readonly tenantRepository: TenantRepository) {}

    async execute(tenantId: string, configurarTenantDto: ConfigurarTenantDto, userId: string): Promise<TenantEntity> {
        // Verificar se tenant existe
        const tenant = await this.tenantRepository.buscarPorId(tenantId);
        if (!tenant) {
            throw CustomError.notfound('Tenant não encontrado');
        }

        // Verificar se tenant está ativo
        if (tenant.status !== 'ATIVO') {
            throw CustomError.badRequest('Apenas tenants ativos podem ser configurados');
        }

        return await this.tenantRepository.configurar(tenantId, configurarTenantDto, userId);
    }
}