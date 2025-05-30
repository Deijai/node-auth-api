// domain/use-cases/tenant/criar-tenant.use-case.ts
import { TenantRepository } from '../../repositories/tenant.repository';
import { CriarTenantDto } from '../../dtos/tenant/criar-tenant.dto';
import { TenantEntity } from '../../entities/tenant.entity';
import { CustomError } from '../../errors/custom.error';

interface CriarTenantUseCase {
    execute(criarTenantDto: CriarTenantDto, userId: string): Promise<TenantEntity>;
}

export class CriarTenant implements CriarTenantUseCase {
    constructor(private readonly tenantRepository: TenantRepository) {}

    async execute(criarTenantDto: CriarTenantDto, userId: string): Promise<TenantEntity> {
        // Verificar se código já existe
        const codigoExistente = await this.tenantRepository.buscarPorCodigo(criarTenantDto.codigo);
        if (codigoExistente) {
            throw CustomError.badRequest('Código já está em uso');
        }

        // Verificar se subdomínio já existe
        const subdomainExistente = await this.tenantRepository.buscarPorSubdomain(criarTenantDto.subdomain);
        if (subdomainExistente) {
            throw CustomError.badRequest('Subdomínio já está em uso');
        }

        // Verificar se CNPJ já existe (se fornecido)
        if (criarTenantDto.cnpj) {
            const cnpjExistente = await this.tenantRepository.buscarPorCnpj(criarTenantDto.cnpj);
            if (cnpjExistente) {
                throw CustomError.badRequest('CNPJ já está cadastrado');
            }
        }

        return await this.tenantRepository.criar(criarTenantDto, userId);
    }
}
