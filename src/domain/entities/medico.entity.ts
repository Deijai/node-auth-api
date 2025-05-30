// domain/entities/medico.entity.ts
export class MedicoEntity {
    constructor(
        public id: string,
        public tenant_id: string,
        public pessoa_id: string,
        public crm: string,
        public especialidade: string,
        public conselho_estado: string,
        public data_formacao?: Date,
        public instituicao_formacao?: string,
        public residencias?: Array<{
            especialidade: string;
            instituicao: string;
            ano_inicio: number;
            ano_fim: number;
        }>,
        public unidades_vinculadas?: string[],
        public horarios_atendimento?: Array<{
            dia_semana: number;
            hora_inicio: string;
            hora_fim: string;
            unidade_id: string;
        }>,
        public valor_consulta?: number,
        public aceita_convenio?: boolean,
        public convenios?: string[],
        public created_at?: Date,
        public updated_at?: Date,
        public created_by?: string,
        public updated_by?: string,
        // Dados da pessoa (quando populado)
        public pessoa?: {
            nome: string;
            cpf: string;
            data_nascimento: Date;
            sexo: 'M' | 'F' | 'O';
            telefone?: string;
            email?: string;
            endereco?: any;
        }
    ) {}
}