import { Validators } from "../../../config";

// domain/dtos/medico/atualizar-medico.dto.ts
export class AtualizarMedicoDto {
    private constructor(
        public especialidade?: string,
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
            dia_semana: number;
            hora_inicio: string;
            hora_fim: string;
            unidade_id: string;
        }>,
        public valor_consulta?: number,
        public aceita_convenio?: boolean,
        public convenios?: string[]
    ) {}

    static create(object: { [key: string]: any }): [string?, AtualizarMedicoDto?] {
        const { 
            especialidade, data_formacao, instituicao_formacao, residencias,
            unidades_vinculadas, horarios_atendimento, valor_consulta,
            aceita_convenio, convenios
        } = object;

        if (especialidade !== undefined) {
            if (!especialidade || especialidade.length > 255) {
                return ['Especialidade inválida'];
            }
        }

        if (data_formacao !== undefined) {
            const dataForm = new Date(data_formacao);
            if (isNaN(dataForm.getTime())) return ['Data de formação inválida'];
            if (dataForm > new Date()) return ['Data de formação não pode ser futura'];
        }

        if (residencias !== undefined && Array.isArray(residencias)) {
            for (const residencia of residencias) {
                if (!residencia.especialidade || !residencia.instituicao || 
                    !residencia.ano_inicio || !residencia.ano_fim) {
                    return ['Residência deve ter especialidade, instituição, ano início e fim'];
                }
            }
        }

        if (unidades_vinculadas !== undefined && Array.isArray(unidades_vinculadas)) {
            for (const unidadeId of unidades_vinculadas) {
                if (!Validators.mongoId.test(unidadeId)) {
                    return ['ID de unidade inválido'];
                }
            }
        }

        if (horarios_atendimento !== undefined && Array.isArray(horarios_atendimento)) {
            for (const horario of horarios_atendimento) {
                if (horario.dia_semana < 0 || horario.dia_semana > 6) {
                    return ['Dia da semana deve estar entre 0 e 6'];
                }
                if (!Validators.hora.test(horario.hora_inicio) || !Validators.hora.test(horario.hora_fim)) {
                    return ['Formato de hora inválido (use HH:MM)'];
                }
            }
        }

        if (valor_consulta !== undefined && valor_consulta < 0) {
            return ['Valor da consulta não pode ser negativo'];
        }

        return [undefined, new AtualizarMedicoDto(
            especialidade?.trim(),
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