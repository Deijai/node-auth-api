// infrastructure/mappers/unidade.mapper.ts
import { CustomError } from "../../domain";
import { UnidadeEntity } from "../../domain/entities/unidade.entity";

export class UnidadeMapper {
    static unidadeEntityFromObject(object: { [key: string]: any }): UnidadeEntity {
        const { 
            id, _id, tenant_id, nome, tipo, cnes, endereco, contato,
            horario_funcionamento, especialidades, capacidade, equipamentos,
            gestor_responsavel, created_at, updated_at, created_by, updated_by
        } = object;

        if (!_id && !id) throw CustomError.badRequest('ID obrigatório');
        if (!tenant_id) throw CustomError.badRequest('Tenant ID obrigatório');
        if (!nome) throw CustomError.badRequest('Nome da unidade obrigatório');
        if (!tipo) throw CustomError.badRequest('Tipo da unidade obrigatório');

        return new UnidadeEntity(
            _id || id,
            tenant_id,
            nome,
            tipo,
            cnes,
            endereco,
            contato,
            horario_funcionamento,
            especialidades,
            capacidade,
            equipamentos,
            gestor_responsavel,
            created_at,
            updated_at,
            created_by,
            updated_by
        );
    }
}