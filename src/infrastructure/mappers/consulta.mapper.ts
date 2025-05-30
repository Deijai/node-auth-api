// infrastructure/mappers/consulta.mapper.ts
import { CustomError } from "../../domain";
import { ConsultaEntity } from "../../domain/entities/consulta.entity";

export class ConsultaMapper {
    static consultaEntityFromObject(object: { [key: string]: any }): ConsultaEntity {
        const { 
            id, _id, tenant_id, paciente_id, medico_id, unidade_id,
            data_hora_agendada, data_hora_inicio, data_hora_fim, tipo_consulta,
            especialidade, status, motivo_consulta, sintomas, diagnostico,
            observacoes, receituario, exames_solicitados, sinais_vitais,
            triagem, valor_consulta, forma_pagamento, convenio,
            created_at, updated_at, created_by, updated_by,
            paciente, medico, unidade
        } = object;

        if (!_id && !id) throw CustomError.badRequest('ID obrigatório');
        if (!tenant_id) throw CustomError.badRequest('Tenant ID obrigatório');
        if (!paciente_id) throw CustomError.badRequest('ID do paciente obrigatório');
        if (!medico_id) throw CustomError.badRequest('ID do médico obrigatório');
        if (!unidade_id) throw CustomError.badRequest('ID da unidade obrigatório');
        if (!data_hora_agendada) throw CustomError.badRequest('Data e hora agendada obrigatórias');
        if (!tipo_consulta) throw CustomError.badRequest('Tipo da consulta obrigatório');

        return new ConsultaEntity(
            _id || id,
            tenant_id,
            paciente_id,
            medico_id,
            unidade_id,
            new Date(data_hora_agendada),
            data_hora_inicio ? new Date(data_hora_inicio) : new Date(),
            data_hora_fim ? new Date(data_hora_fim) : new Date(),
            tipo_consulta,
            especialidade,
            status || 'AGENDADA',
            motivo_consulta,
            sintomas,
            diagnostico,
            observacoes,
            receituario,
            exames_solicitados,
            sinais_vitais,
            triagem,
            valor_consulta,
            forma_pagamento,
            convenio,
            created_at,
            updated_at,
            created_by,
            updated_by,
            paciente,
            medico,
            unidade
        );
    }
}