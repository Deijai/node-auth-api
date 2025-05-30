// domain/use-cases/tenant/verificar-limites.use-case.ts
import { TenantRepository } from '../../repositories/tenant.repository';
import { CustomError } from '../../errors/custom.error';

interface VerificarLimitesUseCase {
    execute(tenantId: string): Promise<{ [limite: string]: { atual: number; maximo: number; excedeu: boolean } }>;
}

export class VerificarLimites implements VerificarLimitesUseCase {
    constructor(private readonly tenantRepository: TenantRepository) {}

    async execute(tenantId: string): Promise<{ [limite: string]: { atual: number; maximo: number; excedeu: boolean } }> {
        // Verificar se tenant existe
        const tenant = await this.tenantRepository.buscarPorId(tenantId);
        if (!tenant) {
            throw CustomError.notfound('Tenant não encontrado');
        }

        return await this.tenantRepository.verificarLimites(tenantId);
    }
}