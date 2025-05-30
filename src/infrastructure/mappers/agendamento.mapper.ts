// infrastructure/mappers/agendamento.mapper.ts
import { CustomError } from "../../domain";
import { AgendamentoEntity } from "../../domain/entities/agendamento.entity";

export class AgendamentoMapper {
    static agendamentoEntityFromObject(object: { [key: string]: any }): AgendamentoEntity {
        const { 
            id, _id, tenant_id, paciente_id, medico_id, unidade_id,
            data_hora, duracao_estimada, tipo_agendamento, especialidade,
            status, observacoes, agendado_por, confirmado_em, cancelado_em,
            motivo_cancelamento, prioridade, lembrete_enviado,
            created_at, updated_at, created_by, updated_by,
            paciente, medico, unidade
        } = object;

        if (!_id && !id) throw CustomError.badRequest('ID obrigatório');
        if (!tenant_id) throw CustomError.badRequest('Tenant ID obrigatório');
        if (!paciente_id) throw CustomError.badRequest('ID do paciente obrigatório');
        if (!unidade_id) throw CustomError.badRequest('ID da unidade obrigatório');
        if (!data_hora) throw CustomError.badRequest('Data e hora obrigatórias');
        if (!tipo_agendamento) throw CustomError.badRequest('Tipo de agendamento obrigatório');

        return new AgendamentoEntity(
            _id || id,
            tenant_id,
            paciente_id,
            medico_id,
            unidade_id,
            new Date(data_hora),
            duracao_estimada || 30,
            tipo_agendamento,
            especialidade,
            status || 'AGENDADO',
            observacoes,
            agendado_por,
            confirmado_em ? new Date(confirmado_em) : undefined,
            cancelado_em ? new Date(cancelado_em) : undefined,
            motivo_cancelamento,
            prioridade || 'NORMAL',
            lembrete_enviado || false,
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