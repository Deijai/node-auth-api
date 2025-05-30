// domain/dtos/pessoa/buscar-pessoa.dto.ts
export class BuscarPessoaDto {
    private constructor(
        public page: number = 1,
        public limit: number = 20,
        public search?: string,
        public sexo?: 'M' | 'F' | 'O',
        public status?: 'ATIVO' | 'INATIVO',
        public cidade?: string,
        public estado?: string
    ) {}

    static create(object: { [key: string]: any }): [string?, BuscarPessoaDto?] {
        const { page, limit, search, sexo, status, cidade, estado } = object;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;

        if (pageNum < 1) return ['Página deve ser maior que 0'];
        if (limitNum < 1 || limitNum > 100) return ['Limit deve estar entre 1 e 100'];

        if (sexo && !['M', 'F', 'O'].includes(sexo)) {
            return ['Sexo deve ser M, F ou O'];
        }

        if (status && !['ATIVO', 'INATIVO'].includes(status)) {
            return ['Status deve ser ATIVO ou INATIVO'];
        }

        return [undefined, new BuscarPessoaDto(
            pageNum,
            limitNum,
            search?.trim(),
            sexo,
            status,
            cidade?.trim(),
            estado?.trim()
        )];
    }
}