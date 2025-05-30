// domain/dtos/especialidade/buscar-especialidade.dto.ts
export class BuscarEspecialidadeDto {
    private constructor(
        public page: number = 1,
        public limit: number = 20,
        public search?: string,
        public area_medica?: 'CLINICA_MEDICA' | 'CIRURGIA' | 'PEDIATRIA' | 'GINECOLOGIA' | 'PSIQUIATRIA' | 'RADIOLOGIA' | 'PATOLOGIA' | 'OUTROS',
        public ativa?: boolean,
        public requer_residencia?: boolean
    ) {}

    static create(object: { [key: string]: any }): [string?, BuscarEspecialidadeDto?] {
        const { page, limit, search, area_medica, ativa, requer_residencia } = object;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;

        if (pageNum < 1) return ['Página deve ser maior que 0'];
        if (limitNum < 1 || limitNum > 100) return ['Limit deve estar entre 1 e 100'];

        if (area_medica !== undefined) {
            const areasValidas = ['CLINICA_MEDICA', 'CIRURGIA', 'PEDIATRIA', 'GINECOLOGIA', 'PSIQUIATRIA', 'RADIOLOGIA', 'PATOLOGIA', 'OUTROS'];
            if (!areasValidas.includes(area_medica)) {
                return ['Área médica inválida'];
            }
        }

        return [undefined, new BuscarEspecialidadeDto(
            pageNum,
            limitNum,
            search?.trim(),
            area_medica,
            ativa === 'true' || ativa === true,
            requer_residencia === 'true' || requer_residencia === true
        )];
    }
}