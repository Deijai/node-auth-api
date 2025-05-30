// domain/dtos/consulta/finalizar-consulta.dto.ts
export class FinalizarConsultaDto {
    private constructor(
        public diagnostico: string,
        public receituario?: Array<{
            medicamento: string;
            dosagem: string;
            frequencia: string;
            duracao: string;
            observacoes?: string;
        }>,
        public exames_solicitados?: Array<{
            tipo_exame: string;
            laboratorio?: string;
            observacoes?: string;
            urgente: boolean;
        }>,
        public observacoes?: string,
        public orientacoes?: string,
        public data_retorno?: Date
    ) {}

    static create(object: { [key: string]: any }): [string?, FinalizarConsultaDto?] {
        const { 
            diagnostico, receituario, exames_solicitados, observacoes, 
            orientacoes, data_retorno 
        } = object;

        if (!diagnostico) return ['Diagnóstico é obrigatório'];
        if (diagnostico.length < 10) return ['Diagnóstico deve ter pelo menos 10 caracteres'];

        if (receituario && Array.isArray(receituario)) {
            for (const item of receituario) {
                if (!item.medicamento || !item.dosagem || !item.frequencia || !item.duracao) {
                    return ['Receituário deve conter medicamento, dosagem, frequência e duração'];
                }
            }
        }

        if (exames_solicitados && Array.isArray(exames_solicitados)) {
            for (const exame of exames_solicitados) {
                if (!exame.tipo_exame) {
                    return ['Tipo de exame é obrigatório'];
                }
                if (exame.urgente === undefined) {
                    exame.urgente = false;
                }
            }
        }

        if (data_retorno) {
            const dataRet = new Date(data_retorno);
            if (isNaN(dataRet.getTime())) return ['Data de retorno inválida'];
            if (dataRet <= new Date()) return ['Data de retorno deve ser futura'];
        }

        return [undefined, new FinalizarConsultaDto(
            diagnostico.trim(),
            receituario,
            exames_solicitados,
            observacoes?.trim(),
            orientacoes?.trim(),
            data_retorno ? new Date(data_retorno) : undefined
        )];
    }
}