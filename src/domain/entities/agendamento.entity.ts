// domain/entities/agendamento.entity.ts
export class AgendamentoEntity {
    constructor(
        public id: string,
        public tenant_id: string,
        public paciente_id: string,
        public medico_id: string,
        public unidade_id: string,
        public data_hora: Date,
        public duracao_estimada: number = 30, // minutos
        public tipo_agendamento: 'CONSULTA' | 'EXAME' | 'PROCEDIMENTO' | 'VACINA',
        public especialidade?: string,
        public status: 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' | 'REAGENDADO' | 'REALIZADO' = 'AGENDADO',
        public observacoes?: string,
        public agendado_por?: string,
        public confirmado_em?: Date,
        public cancelado_em?: Date,
        public motivo_cancelamento?: string,
        public prioridade: 'NORMAL' | 'ALTA' | 'URGENTE' = 'NORMAL',
        public lembrete_enviado?: boolean,
        public created_at?: Date,
        public updated_at?: Date,
        public created_by?: string,
        public updated_by?: string,
        // Dados populados
        public paciente?: {
            pessoa: {
                nome: string;
                cpf: string;
                telefone?: string;
                email?: string;
            };
        },
        public medico?: {
            pessoa: {
                nome: string;
            };
            crm: string;
            especialidade: string;
        },
        public unidade?: {
            nome: string;
            tipo: string;
        }
    ) {}

    // Método para verificar se está próximo do horário
    estaProximo(minutosAntecedencia: number = 30): boolean {
        const agora = new Date();
        const diferencaMinutos = Math.round((this.data_hora.getTime() - agora.getTime()) / (1000 * 60));
        return diferencaMinutos <= minutosAntecedencia && diferencaMinutos > 0;
    }

    // Método para verificar se pode ser cancelado
    podeCancelar(): boolean {
        if (this.status !== 'AGENDADO' && this.status !== 'CONFIRMADO') return false;
        const agora = new Date();
        const horasAntecedencia = Math.round((this.data_hora.getTime() - agora.getTime()) / (1000 * 60 * 60));
        return horasAntecedencia >= 2; // Cancelamento até 2 horas antes
    }

    // Método para verificar se pode ser reagendado
    podeReagendar(): boolean {
        return ['AGENDADO', 'CONFIRMADO', 'CANCELADO'].includes(this.status);
    }

    // Método para calcular horário de fim
    getHorarioFim(): Date {
        return new Date(this.data_hora.getTime() + this.duracao_estimada * 60 * 1000);
    }

    // Método para verificar conflito de horário
    temConflitoCom(outroAgendamento: AgendamentoEntity): boolean {
        const meuFim = this.getHorarioFim();
        const outroFim = outroAgendamento.getHorarioFim();
        
        return (this.data_hora < outroFim && meuFim > outroAgendamento.data_hora);
    }
}