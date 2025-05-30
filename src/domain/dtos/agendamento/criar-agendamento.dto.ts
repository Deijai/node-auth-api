import { Validators } from "../../../config";

// domain/dtos/agendamento/criar-agendamento.dto.ts
export class CriarAgendamentoDto {
    private constructor(
        public paciente_id: string,
        public medico_id: string | undefined,
        public unidade_id: string,
        public data_hora: Date,
        public duracao_estimada: number = 30,
        public tipo_agendamento: 'CONSULTA' | 'EXAME' | 'PROCEDIMENTO' | 'VACINA',
        public especialidade?: string,
        public observacoes?: string,
        public prioridade?: 'NORMAL' | 'ALTA' | 'URGENTE'
    ) {}

    static create(object: { [key: string]: any }): [string?, CriarAgendamentoDto?] {
        const { 
            paciente_id, medico_id, unidade_id, data_hora, duracao_estimada,
            tipo_agendamento, especialidade, observacoes, prioridade 
        } = object;

        if (!paciente_id) return ['ID do paciente é obrigatório'];
        if (!Validators.mongoId.test(paciente_id)) return ['ID do paciente inválido'];

        if (medico_id && !Validators.mongoId.test(medico_id)) {
            return ['ID do médico inválido'];
        }

        if (!unidade_id) return ['ID da unidade é obrigatório'];
        if (!Validators.mongoId.test(unidade_id)) return ['ID da unidade inválido'];

        if (!data_hora) return ['Data e hora são obrigatórias'];
        const dataHora = new Date(data_hora);
        if (isNaN(dataHora.getTime())) return ['Data e hora inválidas'];
        if (dataHora <= new Date()) return ['Data e hora devem ser futuras'];

        if (!tipo_agendamento) return ['Tipo de agendamento é obrigatório'];
        const tiposValidos = ['CONSULTA', 'EXAME', 'PROCEDIMENTO', 'VACINA'];
        if (!tiposValidos.includes(tipo_agendamento)) {
            return ['Tipo de agendamento inválido'];
        }

        // Para consultas, médico é obrigatório
        if (tipo_agendamento === 'CONSULTA' && !medico_id) {
            return ['Médico é obrigatório para consultas'];
        }

        const duracaoNum = parseInt(duracao_estimada) || 30;
        if (duracaoNum < 5 || duracaoNum > 480) { // 5 min a 8 horas
            return ['Duração deve estar entre 5 minutos e 8 horas'];
        }

        if (prioridade !== undefined) {
            const prioridadesValidas = ['NORMAL', 'ALTA', 'URGENTE'];
            if (!prioridadesValidas.includes(prioridade)) {
                return ['Prioridade inválida'];
            }
        }

        return [undefined, new CriarAgendamentoDto(
            paciente_id,
            medico_id,
            unidade_id,
            dataHora,
            duracaoNum,
            tipo_agendamento,
            especialidade?.trim(),
            observacoes?.trim(),
            prioridade || 'NORMAL'
        )];
    }
}