// infrastructure/mappers/medicamento.mapper.ts
import { CustomError } from "../../domain";
import { MedicamentoEntity } from "../../domain/entities/medicamento.entity";

export class MedicamentoMapper {
    static medicamentoEntityFromObject(object: { [key: string]: any }): MedicamentoEntity {
        const { 
            id, _id, tenant_id, nome_comercial, nome_generico, principio_ativo,
            forma_farmaceutica, via_administracao, codigo_ean, registro_anvisa,
            fabricante, concentracao, classe_terapeutica, controlado, tipo_receita,
            disponivel_sus, preco_referencia, estoque_minimo, ativo, observacoes,
            created_at, updated_at, created_by, updated_by
        } = object;

        if (!_id && !id) throw CustomError.badRequest('ID obrigatório');
        if (!tenant_id) throw CustomError.badRequest('Tenant ID obrigatório');
        if (!nome_comercial) throw CustomError.badRequest('Nome comercial obrigatório');
        if (!nome_generico) throw CustomError.badRequest('Nome genérico obrigatório');
        if (!principio_ativo) throw CustomError.badRequest('Princípio ativo obrigatório');

        return new MedicamentoEntity(
            _id || id,
            tenant_id,
            nome_comercial,
            nome_generico,
            principio_ativo,
            forma_farmaceutica,
            via_administracao,
            codigo_ean,
            registro_anvisa,
            fabricante,
            concentracao,
            classe_terapeutica,
            controlado || false,
            tipo_receita || 'COMUM',
            disponivel_sus || false,
            preco_referencia,
            estoque_minimo || 0,
            ativo !== false, // Default true
            observacoes,
            created_at,
            updated_at,
            created_by,
            updated_by
        );
    }
}