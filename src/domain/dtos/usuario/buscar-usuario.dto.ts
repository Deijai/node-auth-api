import { Validators } from "../../../config";

// domain/dtos/usuario/buscar-usuario.dto.ts
export class BuscarUsuarioDto {
    private constructor(
        public page: number = 1,
        public limit: number = 20,
        public search?: string,
        public papel?: 'ADMIN' | 'MEDICO' | 'ENFERMEIRO' | 'RECEPCIONISTA' | 'FARMACEUTICO' | 'LABORATORISTA' | 'GESTOR',
        public ativo?: boolean,
        public unidade_id?: string
    ) {}

    static create(object: { [key: string]: any }): [string?, BuscarUsuarioDto?] {
        const { page, limit, search, papel, ativo, unidade_id } = object;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;

        if (pageNum < 1) return ['Página deve ser maior que 0'];
        if (limitNum < 1 || limitNum > 100) return ['Limit deve estar entre 1 e 100'];

        if (papel !== undefined) {
            const papeisValidos = ['ADMIN', 'MEDICO', 'ENFERMEIRO', 'RECEPCIONISTA', 'FARMACEUTICO', 'LABORATORISTA', 'GESTOR'];
            if (!papeisValidos.includes(papel)) {
                return ['Papel inválido'];
            }
        }

        if (unidade_id && !Validators.mongoId.test(unidade_id)) {
            return ['ID da unidade inválido'];
        }

        return [undefined, new BuscarUsuarioDto(
            pageNum,
            limitNum,
            search?.trim(),
            papel,
            ativo === 'true' || ativo === true,
            unidade_id
        )];
    }
}