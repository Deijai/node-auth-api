import { Validators } from "../../../config";

// domain/dtos/medico/buscar-medico.dto.ts
export class BuscarMedicoDto {
    private constructor(
        public page: number = 1,
        public limit: number = 20,
        public search?: string,
        public especialidade?: string,
        public conselho_estado?: string,
        public unidade_id?: string,
        public aceita_convenio?: boolean,
        public disponivel_hoje?: boolean
    ) {}

    static create(object: { [key: string]: any }): [string?, BuscarMedicoDto?] {
        const { 
            page, limit, search, especialidade, conselho_estado, 
            unidade_id, aceita_convenio, disponivel_hoje 
        } = object;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;

        if (pageNum < 1) return ['Página deve ser maior que 0'];
        if (limitNum < 1 || limitNum > 100) return ['Limit deve estar entre 1 e 100'];

        if (unidade_id && !Validators.mongoId.test(unidade_id)) {
            return ['ID da unidade inválido'];
        }

        return [undefined, new BuscarMedicoDto(
            pageNum,
            limitNum,
            search?.trim(),
            especialidade?.trim(),
            conselho_estado?.toUpperCase().trim(),
            unidade_id,
            aceita_convenio === 'true' || aceita_convenio === true,
            disponivel_hoje === 'true' || disponivel_hoje === true
        )];
    }
}