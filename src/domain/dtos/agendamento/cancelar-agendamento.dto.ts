// domain/dtos/agendamento/cancelar-agendamento.dto.ts
export class CancelarAgendamentoDto {
    private constructor(
        public motivo_cancelamento: string
    ) {}

    static create(object: { [key: string]: any }): [string?, CancelarAgendamentoDto?] {
        const { motivo_cancelamento } = object;

        if (!motivo_cancelamento) return ['Motivo do cancelamento é obrigatório'];
        if (motivo_cancelamento.length < 5) {
            return ['Motivo do cancelamento deve ter pelo menos 5 caracteres'];
        }

        return [undefined, new CancelarAgendamentoDto(motivo_cancelamento.trim())];
    }
}