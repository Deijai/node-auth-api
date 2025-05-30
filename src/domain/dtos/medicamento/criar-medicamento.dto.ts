// ===================================
// domain/dtos/medicamento/criar-medicamento.dto.ts
// ===================================
export class CriarMedicamentoDto {
    private constructor(
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
        public controlado?: boolean,
        public tipo_receita?: 'COMUM' | 'ESPECIAL' | 'CONTROLE_ESPECIAL' | 'A1' | 'A2' | 'A3' | 'B1' | 'B2' | 'C1' | 'C2',
        public disponivel_sus?: boolean,
        public preco_referencia?: number,
        public estoque_minimo?: number,
        public observacoes?: string
    ) {}

    static create(object: { [key: string]: any }): [string?, CriarMedicamentoDto?] {
        const { 
            nome_comercial, nome_generico, principio_ativo, forma_farmaceutica,
            via_administracao, codigo_ean, registro_anvisa, fabricante, 
            concentracao, classe_terapeutica, controlado, tipo_receita,
            disponivel_sus, preco_referencia, estoque_minimo, observacoes
        } = object;

        if (!nome_comercial) return ['Nome comercial é obrigatório'];
        if (nome_comercial.length > 255) return ['Nome comercial não pode exceder 255 caracteres'];

        if (!nome_generico) return ['Nome genérico é obrigatório'];
        if (nome_generico.length > 255) return ['Nome genérico não pode exceder 255 caracteres'];

        if (!principio_ativo) return ['Princípio ativo é obrigatório'];
        if (principio_ativo.length > 255) return ['Princípio ativo não pode exceder 255 caracteres'];

        if (!forma_farmaceutica) return ['Forma farmacêutica é obrigatória'];
        const formasValidas = ['COMPRIMIDO', 'CAPSULA', 'XAROPE', 'INJECAO', 'POMADA', 'CREME', 'GOTAS', 'SPRAY', 'OUTROS'];
        if (!formasValidas.includes(forma_farmaceutica)) {
            return ['Forma farmacêutica inválida'];
        }

        if (!via_administracao) return ['Via de administração é obrigatória'];
        const viasValidas = ['ORAL', 'TOPICA', 'INTRAVENOSA', 'INTRAMUSCULAR', 'SUBCUTANEA', 'INALATORIA', 'OFTALMOLOGICA', 'OUTROS'];
        if (!viasValidas.includes(via_administracao)) {
            return ['Via de administração inválida'];
        }

        if (codigo_ean && codigo_ean.length > 20) {
            return ['Código EAN não pode exceder 20 caracteres'];
        }

        if (tipo_receita) {
            const tiposValidos = ['COMUM', 'ESPECIAL', 'CONTROLE_ESPECIAL', 'A1', 'A2', 'A3', 'B1', 'B2', 'C1', 'C2'];
            if (!tiposValidos.includes(tipo_receita)) {
                return ['Tipo de receita inválido'];
            }
        }

        if (preco_referencia !== undefined && preco_referencia < 0) {
            return ['Preço de referência não pode ser negativo'];
        }

        if (estoque_minimo !== undefined && estoque_minimo < 0) {
            return ['Estoque mínimo não pode ser negativo'];
        }

        return [undefined, new CriarMedicamentoDto(
            nome_comercial.trim(),
            nome_generico.trim(),
            principio_ativo.trim(),
            forma_farmaceutica,
            via_administracao,
            codigo_ean?.trim(),
            registro_anvisa?.trim(),
            fabricante?.trim(),
            concentracao?.trim(),
            classe_terapeutica?.trim(),
            controlado || false,
            tipo_receita || 'COMUM',
            disponivel_sus || false,
            preco_referencia,
            estoque_minimo || 0,
            observacoes?.trim()
        )];
    }
}