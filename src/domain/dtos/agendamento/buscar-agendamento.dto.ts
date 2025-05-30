import { Validators } from "../../../config";

// domain/dtos/agendamento/buscar-agendamento.dto.ts
export class BuscarAgendamentoDto {
    private constructor(
        public page: number = 1,
        public limit: number = 20,
        public paciente_id?: string,
        public medico_id?: string,
        public unidade_id?: string,
        public data_inicio?: Date,
        public data_fim?: Date,
        public tipo_agendamento?: 'CONSULTA' | 'EXAME' | 'PROCEDIMENTO' | 'VACINA',
        public status?: 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' | 'REAGENDADO' | 'REALIZADO',
        public prioridade?: 'NORMAL' | 'ALTA' | 'URGENTE'
    ) {}

    static create(object: { [key: string]: any }): [string?, BuscarAgendamentoDto?] {
        const { 
            page, limit, paciente_id, medico_id, unidade_id, data_inicio, 
            data_fim, tipo_agendamento, status, prioridade 
        } = object;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;

        if (pageNum < 1) return ['Página deve ser maior que 0'];
        if (limitNum < 1 || limitNum > 100) return ['Limit deve estar entre 1 e 100'];

        if (paciente_id && !Validators.mongoId.test(paciente_id)) {
            return ['ID do paciente inválido'];
        }

        if (medico_id && !Validators.mongoId.test(medico_id)) {
            return ['ID do médico inválido'];
        }

        if (unidade_id && !Validators.mongoId.test(unidade_id)) {
            return ['ID da unidade inválido'];
        }

        let dataInicioDate, dataFimDate;
        if (data_inicio) {
            dataInicioDate = new Date(data_inicio);
            if (isNaN(dataInicioDate.getTime())) return ['Data de início inválida'];
        }

        if (data_fim) {
            dataFimDate = new Date(data_fim);
            if (isNaN(dataFimDate.getTime())) return ['Data de fim inválida'];
        }

        return [undefined, new BuscarAgendamentoDto(
            pageNum,
            limitNum,
            paciente_id,
            medico_id,
            unidade_id,
            dataInicioDate,
            dataFimDate,
            tipo_agendamento,
            status,
            prioridade
        )];
    }
}