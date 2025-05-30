// domain/dtos/consulta/criar-consulta.dto.ts
import { Validators } from '../../../config/validators';

export class CriarConsultaDto {
    private constructor(
        public paciente_id: string,
        public medico_id: string,
        public unidade_id: string,
        public data_hora_agendada: Date,
        public tipo_consulta: 'PRIMEIRA_VEZ' | 'RETORNO' | 'EMERGENCIA' | 'URGENCIA' | 'PREVENTIVA',
        public especialidade?: string,
        public motivo_consulta?: string,
        public valor_consulta?: number,
        public forma_pagamento?: 'SUS' | 'PARTICULAR' | 'CONVENIO' | 'GRATUITO',
        public convenio?: string,
        public observacoes?: string
    ) {}

    static create(object: { [key: string]: any }): [string?, CriarConsultaDto?] {
        const { 
            paciente_id, medico_id, unidade_id, data_hora_agendada, tipo_consulta,
            especialidade, motivo_consulta, valor_consulta, forma_pagamento, 
            convenio, observacoes 
        } = object;

        if (!paciente_id) return ['ID do paciente é obrigatório'];
        if (!Validators.mongoId.test(paciente_id)) return ['ID do paciente inválido'];

        if (!medico_id) return ['ID do médico é obrigatório'];
        if (!Validators.mongoId.test(medico_id)) return ['ID do médico inválido'];

        if (!unidade_id) return ['ID da unidade é obrigatório'];
        if (!Validators.mongoId.test(unidade_id)) return ['ID da unidade inválido'];

        if (!data_hora_agendada) return ['Data e hora do agendamento são obrigatórias'];
        const dataAgendada = new Date(data_hora_agendada);
        if (isNaN(dataAgendada.getTime())) return ['Data e hora inválidas'];
        if (dataAgendada <= new Date()) return ['Data e hora devem ser futuras'];

        if (!tipo_consulta) return ['Tipo da consulta é obrigatório'];
        const tiposValidos = ['PRIMEIRA_VEZ', 'RETORNO', 'EMERGENCIA', 'URGENCIA', 'PREVENTIVA'];
        if (!tiposValidos.includes(tipo_consulta)) {
            return ['Tipo de consulta inválido'];
        }

        if (valor_consulta !== undefined && valor_consulta < 0) {
            return ['Valor da consulta não pode ser negativo'];
        }

        if (forma_pagamento !== undefined) {
            const formasValidas = ['SUS', 'PARTICULAR', 'CONVENIO', 'GRATUITO'];
            if (!formasValidas.includes(forma_pagamento)) {
                return ['Forma de pagamento inválida'];
            }
        }

        if (forma_pagamento === 'CONVENIO' && !convenio) {
            return ['Convênio é obrigatório quando forma de pagamento for CONVENIO'];
        }

        return [undefined, new CriarConsultaDto(
            paciente_id,
            medico_id,
            unidade_id,
            dataAgendada,
            tipo_consulta,
            especialidade?.trim(),
            motivo_consulta?.trim(),
            valor_consulta,
            forma_pagamento,
            convenio?.trim(),
            observacoes?.trim()
        )];
    }
}