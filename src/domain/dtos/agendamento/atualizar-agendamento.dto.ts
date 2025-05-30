// domain/dtos/agendamento/atualizar-agendamento.dto.ts
export class AtualizarAgendamentoDto {
    private constructor(
        public data_hora?: Date,
        public duracao_estimada?: number,
        public observacoes?: string,
        public prioridade?: 'NORMAL' | 'ALTA' | 'URGENTE'
    ) {}

    static create(object: { [key: string]: any }): [string?, AtualizarAgendamentoDto?] {
        const { data_hora, duracao_estimada, observacoes, prioridade } = object;

        let dataHora;
        if (data_hora !== undefined) {
            dataHora = new Date(data_hora);
            if (isNaN(dataHora.getTime())) return ['Data e hora inválidas'];
            if (dataHora <= new Date()) return ['Data e hora devem ser futuras'];
        }

        let duracaoNum;
        if (duracao_estimada !== undefined) {
            duracaoNum = parseInt(duracao_estimada);
            if (duracaoNum < 5 || duracaoNum > 480) {
                return ['Duração deve estar entre 5 minutos e 8 horas'];
            }
        }

        if (prioridade !== undefined) {
            const prioridadesValidas = ['NORMAL', 'ALTA', 'URGENTE'];
            if (!prioridadesValidas.includes(prioridade)) {
                return ['Prioridade inválida'];
            }
        }

        return [undefined, new AtualizarAgendamentoDto(
            dataHora,
            duracaoNum,
            observacoes?.trim(),
            prioridade
        )];
    }
}