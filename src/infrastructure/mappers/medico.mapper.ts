// infrastructure/mappers/medico.mapper.ts
import { CustomError } from "../../domain";
import { Validators } from "../../config";
import { MedicoEntity } from "../../domain/entities/medico.entity";

export class MedicoMapper {
    static medicoEntityFromObject(object: { [key: string]: any }): MedicoEntity {
        const { 
            id, _id, tenant_id, pessoa_id, crm, especialidade, conselho_estado,
            data_formacao, instituicao_formacao, residencias, unidades_vinculadas,
            horarios_atendimento, valor_consulta, aceita_convenio, convenios,
            created_at, updated_at, created_by, updated_by, pessoa
        } = object;

        if (!_id && !id) throw CustomError.badRequest('ID obrigatório');
        if (!tenant_id) throw CustomError.badRequest('Tenant ID obrigatório');
        if (!pessoa_id) throw CustomError.badRequest('ID da pessoa obrigatório');
        if (!crm) throw CustomError.badRequest('CRM obrigatório');
        if (!especialidade) throw CustomError.badRequest('Especialidade obrigatória');
        if (!conselho_estado) throw CustomError.badRequest('Estado do conselho obrigatório');

        return new MedicoEntity(
            _id || id,
            tenant_id,
            pessoa_id,
            crm,
            especialidade,
            conselho_estado,
            data_formacao,
            instituicao_formacao,
            residencias,
            unidades_vinculadas,
            horarios_atendimento,
            valor_consulta,
            aceita_convenio,
            convenios,
            created_at,
            updated_at,
            created_by,
            updated_by,
            pessoa
        );
    }
}