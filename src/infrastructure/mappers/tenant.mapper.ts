// infrastructure/mappers/tenant.mapper.ts
import { CustomError } from "../../domain";
import { TenantEntity } from "../../domain/entities/tenant.entity";

export class TenantMapper {
    static tenantEntityFromObject(object: { [key: string]: any }): TenantEntity {
        const { 
            id, _id, nome, codigo, subdomain, cnpj, endereco, contato,
            configuracoes, limites, plano, status, data_criacao,
            created_at, updated_at, created_by, updated_by
        } = object;

        if (!_id && !id) throw CustomError.badRequest('ID obrigatório');
        if (!nome) throw CustomError.badRequest('Nome obrigatório');
        if (!codigo) throw CustomError.badRequest('Código obrigatório');
        if (!subdomain) throw CustomError.badRequest('Subdomínio obrigatório');

        return new TenantEntity(
            _id || id,
            nome,
            codigo,
            subdomain,
            cnpj,
            endereco,
            contato,
            configuracoes,
            limites,
            plano,
            status || 'ATIVO',
            data_criacao,
            created_at,
            updated_at,
            created_by,
            updated_by
        );
    }
}