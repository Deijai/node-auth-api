import { Validators } from "../../../config";

// domain/dtos/documento/buscar-documento.dto.ts
export class BuscarDocumentoDto {
    private constructor(
        public page: number = 1,
        public limit: number = 20,
        public pessoa_id?: string,
        public tipo?: 'RG' | 'CPF' | 'CNH' | 'PASSAPORTE' | 'CERTIDAO_NASCIMENTO' | 'OUTROS',
        public verificado?: boolean,
        public vencendo?: boolean // Documentos que vencem em 30 dias
    ) {}

    static create(object: { [key: string]: any }): [string?, BuscarDocumentoDto?] {
        const { page, limit, pessoa_id, tipo, verificado, vencendo } = object;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;

        if (pageNum < 1) return ['Página deve ser maior que 0'];
        if (limitNum < 1 || limitNum > 100) return ['Limit deve estar entre 1 e 100'];

        if (pessoa_id && !Validators.mongoId.test(pessoa_id)) {
            return ['ID da pessoa inválido'];
        }

        if (tipo !== undefined) {
            const tiposValidos = ['RG', 'CPF', 'CNH', 'PASSAPORTE', 'CERTIDAO_NASCIMENTO', 'OUTROS'];
            if (!tiposValidos.includes(tipo)) {
                return ['Tipo de documento inválido'];
            }
        }

        return [undefined, new BuscarDocumentoDto(
            pageNum,
            limitNum,
            pessoa_id,
            tipo,
            verificado === 'true' || verificado === true,
            vencendo === 'true' || vencendo === true
        )];
    }
}