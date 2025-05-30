// domain/entities/unidade.entity.ts
export class UnidadeEntity {
    constructor(
        public id: string,
        public tenant_id: string,
        public nome: string,
        public tipo: 'UPA' | 'UBS' | 'HOSPITAL' | 'CLINICA' | 'LABORATORIO' | 'FARMACIA' | 'SECRETARIA',
        public cnes?: string,
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
        },
        public horario_funcionamento?: Array<{
            dia_semana: number;
            hora_abertura: string;
            hora_fechamento: string;
            funciona_24h: boolean;
        }>,
        public especialidades?: Array<{
            nome: string;
            ativa: boolean;
        }>,
        public capacidade?: {
            leitos_total?: number;
            leitos_uti?: number;
            consultorios?: number;
            salas_cirurgia?: number;
        },
        public equipamentos?: Array<{
            nome: string;
            modelo?: string;
            quantidade: number;
            status: 'FUNCIONANDO' | 'MANUTENCAO' | 'INATIVO';
        }>,
        public gestor_responsavel?: string,
        public created_at?: Date,
        public updated_at?: Date,
        public created_by?: string,
        public updated_by?: string
    ) {}

    // Método para verificar se está funcionando agora
    estaFuncionandoAgora(): boolean {
        if (!this.horario_funcionamento || this.horario_funcionamento.length === 0) {
            return true; // Se não tem horário definido, assume que funciona sempre
        }

        const agora = new Date();
        const diaSemana = agora.getDay();
        const horaAtual = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;

        const horarioHoje = this.horario_funcionamento.find(h => h.dia_semana === diaSemana);
        
        if (!horarioHoje) return false;
        if (horarioHoje.funciona_24h) return true;

        return horaAtual >= horarioHoje.hora_abertura && horaAtual <= horarioHoje.hora_fechamento;
    }

    // Método para verificar se tem especialidade ativa
    temEspecialidade(especialidade: string): boolean {
        if (!this.especialidades) return false;
        return this.especialidades.some(esp => 
            esp.nome.toLowerCase() === especialidade.toLowerCase() && esp.ativa
        );
    }

    // Método para obter capacidade total de leitos
    getCapacidadeLeitos(): number {
        return (this.capacidade?.leitos_total || 0) + (this.capacidade?.leitos_uti || 0);
    }
}