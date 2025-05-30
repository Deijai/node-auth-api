// domain/dtos/tenant/buscar-tenant.dto.ts
export class BuscarTenantDto {
    private constructor(
        public page: number = 1,
        public limit: number = 20,
        public search?: string,
        public status?: 'ATIVO' | 'INATIVO' | 'SUSPENSO' | 'PENDENTE',
        public plano?: 'BASICO' | 'INTERMEDIARIO' | 'AVANCADO' | 'PERSONALIZADO',
        public estado?: string
    ) {}

    static create(object: { [key: string]: any }): [string?, BuscarTenantDto?] {
        const { page, limit, search, status, plano, estado } = object;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;

        if (pageNum < 1) return ['Página deve ser maior que 0'];
        if (limitNum < 1 || limitNum > 100) return ['Limit deve estar entre 1 e 100'];

        if (status !== undefined) {
            const statusValidos = ['ATIVO', 'INATIVO', 'SUSPENSO', 'PENDENTE'];
            if (!statusValidos.includes(status)) {
                return ['Status inválido'];
            }
        }

        if (plano !== undefined) {
            const planosValidos = ['BASICO', 'INTERMEDIARIO', 'AVANCADO', 'PERSONALIZADO'];
            if (!planosValidos.includes(plano)) {
                return ['Plano inválido'];
            }
        }

        return [undefined, new BuscarTenantDto(
            pageNum,
            limitNum,
            search?.trim(),
            status,
            plano,
            estado?.trim()
        )];
    }
}
