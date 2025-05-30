// domain/entities/documento.entity.ts
export class DocumentoEntity {
    constructor(
        public id: string,
        public tenant_id: string,
        public pessoa_id: string,
        public tipo: 'RG' | 'CPF' | 'CNH' | 'PASSAPORTE' | 'CERTIDAO_NASCIMENTO' | 'OUTROS',
        public numero: string,
        public orgao_emissor?: string,
        public data_emissao?: Date,
        public data_validade?: Date,
        public imagem_url?: string,
        public verificado: boolean = false,
        public created_at?: Date,
        public updated_at?: Date,
        public created_by?: string,
        public updated_by?: string,
        // Dados da pessoa (quando populado)
        public pessoa?: {
            nome: string;
            cpf: string;
        }
    ) {}

    // Método para verificar se documento está válido
    estaValido(): boolean {
        if (!this.data_validade) return true; // Documentos sem validade são sempre válidos
        return new Date() <= this.data_validade;
    }

    // Método para verificar se documento precisa renovação (30 dias antes do vencimento)
    precisaRenovacao(): boolean {
        if (!this.data_validade) return false;
        const hoje = new Date();
        const diasParaVencimento = Math.ceil((this.data_validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        return diasParaVencimento <= 30 && diasParaVencimento > 0;
    }
}