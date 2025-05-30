// domain/dtos/medico/criar-medico.dto.ts
import { Validators } from '../../../config/validators';

export class CriarMedicoDto {
    private constructor(
        public pessoa_id: string,
        public crm: string,
        public especialidade: string,
        public conselho_estado: string,
        public data_formacao?: Date,
        public instituicao_formacao?: string,
        public residencias?: Array<{
            especialidade: string;
            instituicao: string;
            ano_inicio: number;
            ano_fim: number;
        }>,
        public unidades_vinculadas?: string[],
        public horarios_atendimento?: Array<{
            dia_semana: number; // 0-6 (Dom-Sab)
            hora_inicio: string; // HH:MM
            hora_fim: string; // HH:MM
            unidade_id: string;
        }>,
        public valor_consulta?: number,
        public aceita_convenio?: boolean,
        public convenios?: string[]
    ) {}

    static create(object: { [key: string]: any }): [string?, CriarMedicoDto?] {
        const { 
            pessoa_id, crm, especialidade, conselho_estado, data_formacao,
            instituicao_formacao, residencias, unidades_vinculadas, 
            horarios_atendimento, valor_consulta, aceita_convenio, convenios
        } = object;

        if (!pessoa_id) return ['ID da pessoa é obrigatório'];
        if (!Validators.mongoId.test(pessoa_id)) return ['ID da pessoa inválido'];

        if (!crm) return ['CRM é obrigatório'];
        if (crm.length > 20) return ['CRM não pode exceder 20 caracteres'];

        if (!especialidade) return ['Especialidade é obrigatória'];
        if (especialidade.length > 255) return ['Especialidade não pode exceder 255 caracteres'];

        if (!conselho_estado) return ['Estado do conselho é obrigatório'];
        if (conselho_estado.length !== 2) return ['Estado do conselho deve ter 2 caracteres'];

        if (data_formacao) {
            const dataForm = new Date(data_formacao);
            if (isNaN(dataForm.getTime())) return ['Data de formação inválida'];
            if (dataForm > new Date()) return ['Data de formação não pode ser futura'];
        }

        if (residencias && Array.isArray(residencias)) {
            for (const residencia of residencias) {
                if (!residencia.especialidade || !residencia.instituicao || 
                    !residencia.ano_inicio || !residencia.ano_fim) {
                    return ['Residência deve ter especialidade, instituição, ano início e fim'];
                }
                if (residencia.ano_inicio > residencia.ano_fim) {
                    return ['Ano de início da residência não pode ser maior que ano fim'];
                }
            }
        }

        if (unidades_vinculadas && Array.isArray(unidades_vinculadas)) {
            for (const unidadeId of unidades_vinculadas) {
                if (!Validators.mongoId.test(unidadeId)) {
                    return ['ID de unidade inválido'];
                }
            }
        }

        if (horarios_atendimento && Array.isArray(horarios_atendimento)) {
            for (const horario of horarios_atendimento) {
                if (horario.dia_semana < 0 || horario.dia_semana > 6) {
                    return ['Dia da semana deve estar entre 0 e 6'];
                }
                if (!Validators.hora.test(horario.hora_inicio) || !Validators.hora.test(horario.hora_fim)) {
                    return ['Formato de hora inválido (use HH:MM)'];
                }
                if (!Validators.mongoId.test(horario.unidade_id)) {
                    return ['ID de unidade no horário inválido'];
                }
            }
        }

        if (valor_consulta !== undefined && valor_consulta < 0) {
            return ['Valor da consulta não pode ser negativo'];
        }

        if (convenios && !Array.isArray(convenios)) {
            return ['Convênios deve ser um array'];
        }

        return [undefined, new CriarMedicoDto(
            pessoa_id,
            crm.toUpperCase().trim(),
            especialidade.trim(),
            conselho_estado.toUpperCase().trim(),
            data_formacao ? new Date(data_formacao) : undefined,
            instituicao_formacao?.trim(),
            residencias,
            unidades_vinculadas,
            horarios_atendimento,
            valor_consulta,
            aceita_convenio,
            convenios
        )];
    }
}