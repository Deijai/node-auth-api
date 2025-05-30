// domain/entities/paciente.entity.ts
export class PacienteEntity {
    constructor(
        public id: string,
        public tenant_id: string,
        public pessoa_id: string,
        public numero_cartao_sus?: string,
        public tipo_sanguineo?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
        public alergias?: string,
        public historico_medico?: string,
        public medicamentos_uso_continuo?: Array<{
            nome: string;
            dosagem: string;
            frequencia: string;
        }>,
        public contato_emergencia?: {
            nome: string;
            parentesco: string;
            telefone: string;
        },
        public observacoes?: string,
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