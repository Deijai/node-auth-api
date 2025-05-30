// ===================================
// domain/entities/medicamento.entity.ts
// ===================================
export class MedicamentoEntity {
    constructor(
        public id: string,
        public tenant_id: string,
        public nome_comercial: string,
        public nome_generico: string,
        public principio_ativo: string,
        public forma_farmaceutica: 'COMPRIMIDO' | 'CAPSULA' | 'XAROPE' | 'INJECAO' | 'POMADA' | 'CREME' | 'GOTAS' | 'SPRAY' | 'OUTROS',
        public via_administracao: 'ORAL' | 'TOPICA' | 'INTRAVENOSA' | 'INTRAMUSCULAR' | 'SUBCUTANEA' | 'INALATORIA' | 'OFTALMOLOGICA' | 'OUTROS',
        public codigo_ean?: string,
        public registro_anvisa?: string,
        public fabricante?: string,
        public concentracao?: string,
        public classe_terapeutica?: string,
        public controlado: boolean = false,
        public tipo_receita: 'COMUM' | 'ESPECIAL' | 'CONTROLE_ESPECIAL' | 'A1' | 'A2' | 'A3' | 'B1' | 'B2' | 'C1' | 'C2' = 'COMUM',
        public disponivel_sus: boolean = false,
        public preco_referencia?: number,
        public estoque_minimo: number = 0,
        public ativo: boolean = true,
        public observacoes?: string,
        public created_at?: Date,
        public updated_at?: Date,
        public created_by?: string,
        public updated_by?: string
    ) {}

    // Método para verificar se medicamento é controlado
    ehControlado(): boolean {
        return this.controlado || ['CONTROLE_ESPECIAL', 'A1', 'A2', 'A3', 'B1', 'B2'].includes(this.tipo_receita);
    }

    // Método para verificar se precisa receita especial
    precisaReceitaEspecial(): boolean {
        return ['ESPECIAL', 'CONTROLE_ESPECIAL', 'A1', 'A2', 'A3', 'B1', 'B2', 'C1', 'C2'].includes(this.tipo_receita);
    }

    // Método para obter cor de classificação (para interface)
    getCorClassificacao(): string {
        if (this.ehControlado()) return '#FF4444'; // Vermelho
        if (this.disponivel_sus) return '#4CAF50';  // Verde
        return '#2196F3'; // Azul padrão
    }
}