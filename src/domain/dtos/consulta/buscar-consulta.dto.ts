import { Validators } from "../../../config";

// domain/dtos/consulta/buscar-consulta.dto.ts
export class BuscarConsultaDto {
    private constructor(
        public page: number = 1,
        public limit: number = 20,
        public paciente_id?: string,
        public medico_id?: string,
        public unidade_id?: string,
        public data_inicio?: Date,
        public data_fim?: Date,
        public tipo_consulta?: 'PRIMEIRA_VEZ' | 'RETORNO' | 'EMERGENCIA' | 'URGENCIA' | 'PREVENTIVA',
        public status?: 'AGENDADA' | 'CONFIRMADA' | 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA' | 'NAO_COMPARECEU',
        public especialidade?: string
    ) {}

    static create(object: { [key: string]: any }): [string?, BuscarConsultaDto?] {
        const { 
            page, limit, paciente_id, medico_id, unidade_id, data_inicio, 
            data_fim, tipo_consulta, status, especialidade 
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

        if (dataInicioDate && dataFimDate && dataInicioDate >= dataFimDate) {
            return ['Data de início deve ser anterior à data de fim'];
        }

        return [undefined, new BuscarConsultaDto(
            pageNum,
            limitNum,
            paciente_id,
            medico_id,
            unidade_id,
            dataInicioDate,
            dataFimDate,
            tipo_consulta,
            status,
            especialidade?.trim()
        )];
    }
}