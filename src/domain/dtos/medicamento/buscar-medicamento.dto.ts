// domain/dtos/medicamento/buscar-medicamento.dto.ts
export class BuscarMedicamentoDto {
    private constructor(
        public page: number = 1,
        public limit: number = 20,
        public search?: string,
        public forma_farmaceutica?: 'COMPRIMIDO' | 'CAPSULA' | 'XAROPE' | 'INJECAO' | 'POMADA' | 'CREME' | 'GOTAS' | 'SPRAY' | 'OUTROS',
        public via_administracao?: 'ORAL' | 'TOPICA' | 'INTRAVENOSA' | 'INTRAMUSCULAR' | 'SUBCUTANEA' | 'INALATORIA' | 'OFTALMOLOGICA' | 'OUTROS',
        public controlado?: boolean,
        public disponivel_sus?: boolean,
        public ativo?: boolean,
        public classe_terapeutica?: string
    ) {}

    static create(object: { [key: string]: any }): [string?, BuscarMedicamentoDto?] {
        const { 
            page, limit, search, forma_farmaceutica, via_administracao, 
            controlado, disponivel_sus, ativo, classe_terapeutica 
        } = object;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;

        if (pageNum < 1) return ['Página deve ser maior que 0'];
        if (limitNum < 1 || limitNum > 100) return ['Limit deve estar entre 1 e 100'];

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

        return [undefined, new BuscarMedicamentoDto(
            pageNum,
            limitNum,
            search?.trim(),
            forma_farmaceutica,
            via_administracao,
            controlado === 'true' || controlado === true,
            disponivel_sus === 'true' || disponivel_sus === true,
            ativo === 'true' || ativo === true,
            classe_terapeutica?.trim()
        )];
    }
}