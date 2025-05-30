// infrastructure/mappers/especialidade.mapper.ts
import { CustomError } from "../../domain";
import { EspecialidadeEntity } from "../../domain/entities/especialidade.entity";

export class EspecialidadeMapper {
    static especialidadeEntityFromObject(object: { [key: string]: any }): EspecialidadeEntity {
        const { 
            id, _id, tenant_id, nome, codigo, descricao, area_medica,
            ativa, requer_residencia, tempo_consulta_padrao,
            created_at, updated_at, created_by, updated_by
        } = object;

        if (!_id && !id) throw CustomError.badRequest('ID obrigatório');
        if (!tenant_id) throw CustomError.badRequest('Tenant ID obrigatório');
        if (!nome) throw CustomError.badRequest('Nome obrigatório');
        if (!codigo) throw CustomError.badRequest('Código obrigatório');

        return new EspecialidadeEntity(
            _id || id,
            tenant_id,
            nome,
            codigo,
            descricao,
            area_medica || 'OUTROS',
            ativa !== false, // Default true
            requer_residencia || false,
            tempo_consulta_padrao || 30,
            created_at,
            updated_at,
            created_by,
            updated_by
        );
    }
}