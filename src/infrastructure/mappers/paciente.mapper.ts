// infrastructure/mappers/paciente.mapper.ts
import { CustomError } from "../../domain";
import { PacienteEntity } from "../../domain/entities/paciente.entity";

export class PacienteMapper {
    static pacienteEntityFromObject(object: { [key: string]: any }): PacienteEntity {
        const { 
            id, _id, tenant_id, pessoa_id, numero_cartao_sus, tipo_sanguineo,
            alergias, historico_medico, medicamentos_uso_continuo, contato_emergencia,
            observacoes, created_at, updated_at, created_by, updated_by, pessoa
        } = object;

        if (!_id && !id) throw CustomError.badRequest('ID obrigatório');
        if (!tenant_id) throw CustomError.badRequest('Tenant ID obrigatório');
        if (!pessoa_id) throw CustomError.badRequest('ID da pessoa obrigatório');

        return new PacienteEntity(
            _id || id,
            tenant_id,
            pessoa_id,
            numero_cartao_sus,
            tipo_sanguineo,
            alergias,
            historico_medico,
            medicamentos_uso_continuo,
            contato_emergencia,
            observacoes,
            created_at,
            updated_at,
            created_by,
            updated_by,
            pessoa
        );
    }
}