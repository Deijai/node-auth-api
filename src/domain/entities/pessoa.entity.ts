// domain/entities/pessoa.entity.ts
export class PessoaEntity {
    constructor(
        public id: string,
        public tenant_id: string,
        public nome: string,
        public data_nascimento: Date,
        public sexo: 'M' | 'F' | 'O',
        public cpf: string,
        public telefone?: string,
        public email?: string,
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
        public status: 'ATIVO' | 'INATIVO' = 'ATIVO',
        public created_at?: Date,
        public updated_at?: Date,
        public created_by?: string,
        public updated_by?: string
    ) {}
}
