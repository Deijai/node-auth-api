// domain/entities/tenant.entity.ts
export class TenantEntity {
    constructor(
        public id: string,
        public nome: string,
        public codigo: string,
        public subdomain: string,
        public cnpj?: string,
        public endereco?: {
            logradouro?: string;
            numero?: string;
            complemento?: string;
            bairro?: string;
            cidade?: string;
            estado?: string;
            cep?: string;
            coordenadas?: {
                latitude?: number;
                longitude?: number;
            };
        },
        public contato?: {
            telefone?: string;
            email?: string;
            site?: string;
            responsavel?: string;
            cargo_responsavel?: string;
        },
        public configuracoes?: {
            timezone?: string;
            logo_url?: string;
            favicon_url?: string;
            cores_tema?: {
                primaria?: string;
                secundaria?: string;
                acento?: string;
                fundo?: string;
                texto?: string;
            };
            modulos_ativos?: Array<'UPA' | 'UBS' | 'SECRETARIA' | 'LABORATORIO' | 'FARMACIA' | 'HOSPITAL'>;
            configuracoes_sistema?: {
                permite_agendamento_online?: boolean;
                antecedencia_maxima_agendamento?: number; // dias
                antecedencia_minima_agendamento?: number; // horas
                duracao_padrao_consulta?: number; // minutos
                permite_reagendamento?: boolean;
                limite_reagendamentos?: number;
                tempo_limite_cancelamento?: number; // horas
                notificacoes_ativas?: boolean;
                lembrete_antecedencia?: number; // horas
            };
            configuracoes_clinicas?: {
                usa_triagem_manchester?: boolean;
                obrigatorio_sinais_vitais?: boolean;
                obrigatorio_diagnostico_cid?: boolean;
                permite_prescricao_digital?: boolean;
                validade_receita_dias?: number;
                requer_assinatura_digital?: boolean;
            };
            integracao?: {
                sus_integrado?: boolean;
                laboratorio_externo?: boolean;
                farmacia_popular?: boolean;
                telemedicina?: boolean;
                prontuario_eletronico?: boolean;
            };
        },
        public limites?: {
            usuarios_max?: number;
            pacientes_max?: number;
            unidades_max?: number;
            consultas_mes_max?: number;
            armazenamento_gb?: number;
        },
        public plano?: {
            tipo: 'BASICO' | 'INTERMEDIARIO' | 'AVANCADO' | 'PERSONALIZADO';
            data_inicio: Date;
            data_vencimento?: Date;
            valor_mensal?: number;
            status: 'ATIVO' | 'SUSPENSO' | 'VENCIDO' | 'CANCELADO';
        },
        public status: 'ATIVO' | 'INATIVO' | 'SUSPENSO' | 'PENDENTE' = 'ATIVO',
        public data_criacao?: Date,
        public created_at?: Date,
        public updated_at?: Date,
        public created_by?: string,
        public updated_by?: string
    ) {}

    // Método para verificar se módulo está ativo
    moduloAtivo(modulo: string): boolean {
        return this.configuracoes?.modulos_ativos?.includes(modulo as any) || false;
    }

    // Método para verificar se está dentro dos limites
    dentroDoLimite(tipo: 'usuarios' | 'pacientes' | 'unidades', quantidade: number): boolean {
        switch (tipo) {
            case 'usuarios':
                return !this.limites?.usuarios_max || quantidade <= this.limites.usuarios_max;
            case 'pacientes':
                return !this.limites?.pacientes_max || quantidade <= this.limites.pacientes_max;
            case 'unidades':
                return !this.limites?.unidades_max || quantidade <= this.limites.unidades_max;
            default:
                return true;
        }
    }

    // Método para verificar se plano está ativo
    planoAtivo(): boolean {
        if (!this.plano) return false;
        if (this.plano.status !== 'ATIVO') return false;
        if (this.plano.data_vencimento && new Date() > this.plano.data_vencimento) return false;
        return true;
    }

    // Método para verificar se funcionalidade está disponível no plano
    funcionalidadeDisponivel(funcionalidade: string): boolean {
        if (!this.plano) return false;
        
        const funcionalidadesPorPlano = {
            'BASICO': ['agendamento', 'consultas', 'pacientes'],
            'INTERMEDIARIO': ['agendamento', 'consultas', 'pacientes', 'receitas', 'exames', 'relatorios'],
            'AVANCADO': ['agendamento', 'consultas', 'pacientes', 'receitas', 'exames', 'relatorios', 'internacao', 'fila', 'telemedicina'],
            'PERSONALIZADO': ['all'] // Todas as funcionalidades
        };
        
        const funcionalidades = funcionalidadesPorPlano[this.plano.tipo] || [];
        return funcionalidades.includes('all') || funcionalidades.includes(funcionalidade);
    }

    // Método para obter URL completa
    getUrlCompleta(): string {
        return `https://${this.subdomain}.sistema-saude.com.br`;
    }
}