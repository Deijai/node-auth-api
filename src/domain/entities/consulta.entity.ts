// domain/entities/consulta.entity.ts
export class ConsultaEntity {
    constructor(
        public id: string,
        public tenant_id: string,
        public paciente_id: string,
        public medico_id: string,
        public unidade_id: string,
        public data_hora_agendada: Date,
        public data_hora_inicio: Date,
        public data_hora_fim: Date,
        public tipo_consulta: 'PRIMEIRA_VEZ' | 'RETORNO' | 'EMERGENCIA' | 'URGENCIA' | 'PREVENTIVA',
        public especialidade: string,
        public status: 'AGENDADA' | 'CONFIRMADA' | 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA' | 'NAO_COMPARECEU' = 'AGENDADA',
        public motivo_consulta?: string,
        public sintomas?: string,
        public diagnostico?: string,
        public observacoes?: string,
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
        public sinais_vitais?: {
            pressao_arterial?: string;
            temperatura?: number;
            frequencia_cardiaca?: number;
            frequencia_respiratoria?: number;
            saturacao_oxigenio?: number;
            peso?: number;
            altura?: number;
            imc?: number;
        },
        public triagem?: {
            prioridade: 'VERDE' | 'AMARELA' | 'LARANJA' | 'VERMELHA' | 'AZUL';
            classificacao_manchester?: string;
            tempo_espera_max?: number;
        },
        public valor_consulta?: number,
        public forma_pagamento?: 'SUS' | 'PARTICULAR' | 'CONVENIO' | 'GRATUITO',
        public convenio?: string,
        public created_at?: Date,
        public updated_at?: Date,
        public created_by?: string,
        public updated_by?: string,
        // Dados populados
        public paciente?: {
            pessoa: {
                nome: string;
                cpf: string;
                data_nascimento: Date;
            };
            numero_cartao_sus?: string;
            tipo_sanguineo?: string;
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

    // Método para calcular duração da consulta
    getDuracaoMinutos(): number | null {
        if (!this.data_hora_inicio || !this.data_hora_fim) return null;
        return Math.round((this.data_hora_fim.getTime() - this.data_hora_inicio.getTime()) / (1000 * 60));
    }

    // Método para verificar se consulta está em atraso
    estaEmAtraso(): boolean {
        if (this.status !== 'AGENDADA' && this.status !== 'CONFIRMADA') return false;
        const agora = new Date();
        const atrasoMinutos = Math.round((agora.getTime() - this.data_hora_agendada.getTime()) / (1000 * 60));
        return atrasoMinutos > 15; // Considera atraso após 15 minutos
    }

    // Método para calcular IMC automaticamente
    calcularIMC(): number | null {
        if (!this.sinais_vitais?.peso || !this.sinais_vitais?.altura) return null;
        const alturaMetros = this.sinais_vitais.altura / 100;
        return parseFloat((this.sinais_vitais.peso / (alturaMetros * alturaMetros)).toFixed(2));
    }

    // Método para verificar se pode ser cancelada
    podeCancelar(): boolean {
        return ['AGENDADA', 'CONFIRMADA'].includes(this.status);
    }

    // Método para verificar se pode iniciar atendimento
    podeIniciarAtendimento(): boolean {
        return ['AGENDADA', 'CONFIRMADA'].includes(this.status);
    }
}