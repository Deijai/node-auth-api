// domain/dtos/medicamento/atualizar-medicamento.dto.ts
export class AtualizarMedicamentoDto {
    private constructor(
        public nome_comercial?: string,
        public nome_generico?: string,
        public principio_ativo?: string,
        public forma_farmaceutica?: 'COMPRIMIDO' | 'CAPSULA' | 'XAROPE' | 'INJECAO' | 'POMADA' | 'CREME' | 'GOTAS' | 'SPRAY' | 'OUTROS',
        public via_administracao?: 'ORAL' | 'TOPICA' | 'INTRAVENOSA' | 'INTRAMUSCULAR' | 'SUBCUTANEA' | 'INALATORIA' | 'OFTALMOLOGICA' | 'OUTROS',
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
        public ativo?: boolean,
        public observacoes?: string
    ) {}

    static create(object: { [key: string]: any }): [string?, AtualizarMedicamentoDto?] {
        const { 
            nome_comercial, nome_generico, principio_ativo, forma_farmaceutica,
            via_administracao, codigo_ean, registro_anvisa, fabricante, 
            concentracao, classe_terapeutica, controlado, tipo_receita,
            disponivel_sus, preco_referencia, estoque_minimo, ativo, observacoes
        } = object;

        if (nome_comercial !== undefined && nome_comercial.length > 255) {
            return ['Nome comercial não pode exceder 255 caracteres'];
        }

        if (nome_generico !== undefined && nome_generico.length > 255) {
            return ['Nome genérico não pode exceder 255 caracteres'];
        }

        if (principio_ativo !== undefined && principio_ativo.length > 255) {
            return ['Princípio ativo não pode exceder 255 caracteres'];
        }

        if (forma_farmaceutica !== undefined) {
            const formasValidas = ['COMPRIMIDO', 'CAPSULA', 'XAROPE', 'INJECAO', 'POMADA', 'CREME', 'GOTAS', 'SPRAY', 'OUTROS'];
            if (!formasValidas.includes(forma_farmaceutica)) {
                return ['Forma farmacêutica inválida'];
            }
        }

        if (via_administracao !== undefined) {
            const viasValidas = ['ORAL', 'TOPICA', 'INTRAVENOSA', 'INTRAMUSCULAR', 'SUBCUTANEA', 'INALATORIA', 'OFTALMOLOGICA', 'OUTROS'];
            if (!viasValidas.includes(via_administracao)) {
                return ['Via de administração inválida'];
            }
        }

        if (tipo_receita !== undefined) {
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

        return [undefined, new AtualizarMedicamentoDto(
            nome_comercial?.trim(),
            nome_generico?.trim(),
            principio_ativo?.trim(),
            forma_farmaceutica,
            via_administracao,
            codigo_ean?.trim(),
            registro_anvisa?.trim(),
            fabricante?.trim(),
            concentracao?.trim(),
            classe_terapeutica?.trim(),
            controlado,
            tipo_receita,
            disponivel_sus,
            preco_referencia,
            estoque_minimo,
            ativo,
            observacoes?.trim()
        )];
    }
}