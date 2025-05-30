// services/agendamento.service.ts
export class AgendamentoService {
    
    static gerarHorarios(horaInicio: string, horaFim: string, intervaloMinutos: number = 30): string[] {
        const horarios: string[] = [];
        const inicio = this.horaParaMinutos(horaInicio);
        const fim = this.horaParaMinutos(horaFim);
        
        for (let minutos = inicio; minutos < fim; minutos += intervaloMinutos) {
            horarios.push(this.minutosParaHora(minutos));
        }
        
        return horarios;
    }
    
    static verificarHorarioComercial(dataHora: Date): boolean {
        const hora = dataHora.getHours();
        const diaSemana = dataHora.getDay();
        
        // Segunda a sexta, 7h às 18h
        if (diaSemana >= 1 && diaSemana <= 5) {
            return hora >= 7 && hora < 18;
        }
        
        // Sábado, 8h às 12h
        if (diaSemana === 6) {
            return hora >= 8 && hora < 12;
        }
        
        // Domingo fechado
        return false;
    }
    
    static calcularTempoEspera(agendamentos: any[], horaAtual: Date): number {
        const agendamentosAnteriores = agendamentos.filter(ag => 
            ag.data_hora <= horaAtual && 
            ['AGENDADO', 'CONFIRMADO', 'EM_ANDAMENTO'].includes(ag.status)
        );
        
        return agendamentosAnteriores.length * 30; // 30 min por consulta
    }
    
    static gerarCodigoAgendamento(): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `AG-${timestamp}-${random}`.toUpperCase();
    }
    
    static verificarConflito(agendamento1: any, agendamento2: any): boolean {
        const inicio1 = new Date(agendamento1.data_hora);
        const fim1 = new Date(inicio1.getTime() + agendamento1.duracao_estimada * 60 * 1000);
        
        const inicio2 = new Date(agendamento2.data_hora);
        const fim2 = new Date(inicio2.getTime() + agendamento2.duracao_estimada * 60 * 1000);
        
        return (inicio1 < fim2 && fim1 > inicio2);
    }
    
    private static horaParaMinutos(hora: string): number {
        const [h, m] = hora.split(':').map(Number);
        return h * 60 + m;
    }
    
    private static minutosParaHora(minutos: number): string {
        const h = Math.floor(minutos / 60);
        const m = minutos % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
}
