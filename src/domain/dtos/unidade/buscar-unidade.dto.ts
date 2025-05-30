// domain/dtos/unidade/buscar-unidade.dto.ts
export class BuscarUnidadeDto {
    private constructor(
        public page: number = 1,
        public limit: number = 20,
        public search?: string,
        public tipo?: 'UPA' | 'UBS' | 'HOSPITAL' | 'CLINICA' | 'LABORATORIO' | 'FARMACIA' | 'SECRETARIA',
        public cidade?: string,
        public especialidade?: string,
        public funcionando_agora?: boolean
    ) {}

    static create(object: { [key: string]: any }): [string?, BuscarUnidadeDto?] {
        const { page, limit, search, tipo, cidade, especialidade, funcionando_agora } = object;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;

        if (pageNum < 1) return ['Página deve ser maior que 0'];
        if (limitNum < 1 || limitNum > 100) return ['Limit deve estar entre 1 e 100'];

        if (tipo !== undefined) {
            const tiposValidos = ['UPA', 'UBS', 'HOSPITAL', 'CLINICA', 'LABORATORIO', 'FARMACIA', 'SECRETARIA'];
            if (!tiposValidos.includes(tipo)) {
                return ['Tipo de unidade inválido'];
            }
        }

        return [undefined, new BuscarUnidadeDto(
            pageNum,
            limitNum,
            search?.trim(),
            tipo,
            cidade?.trim(),
            especialidade?.trim(),
            funcionando_agora === 'true' || funcionando_agora === true
        )];
    }
}