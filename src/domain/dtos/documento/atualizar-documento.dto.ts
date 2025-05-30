import { Validators } from "../../../config";

// domain/dtos/documento/atualizar-documento.dto.ts
export class AtualizarDocumentoDto {
    private constructor(
        public numero?: string,
        public orgao_emissor?: string,
        public data_emissao?: Date,
        public data_validade?: Date,
        public imagem_url?: string,
        public verificado?: boolean
    ) {}

    static create(object: { [key: string]: any }): [string?, AtualizarDocumentoDto?] {
        const { 
            numero, orgao_emissor, data_emissao, data_validade, 
            imagem_url, verificado 
        } = object;

        if (numero !== undefined) {
            if (!numero || numero.length > 50) {
                return ['Número do documento inválido'];
            }
        }

        if (orgao_emissor !== undefined && orgao_emissor.length > 100) {
            return ['Órgão emissor não pode exceder 100 caracteres'];
        }

        if (data_emissao !== undefined) {
            const dataEmis = new Date(data_emissao);
            if (isNaN(dataEmis.getTime())) return ['Data de emissão inválida'];
            if (dataEmis > new Date()) return ['Data de emissão não pode ser futura'];
        }

        if (data_validade !== undefined) {
            const dataVal = new Date(data_validade);
            if (isNaN(dataVal.getTime())) return ['Data de validade inválida'];
        }

        if (imagem_url !== undefined && imagem_url && !Validators.url.test(imagem_url)) {
            return ['URL da imagem inválida'];
        }

        return [undefined, new AtualizarDocumentoDto(
            numero?.replace(/\D/g, ''),
            orgao_emissor?.trim(),
            data_emissao ? new Date(data_emissao) : undefined,
            data_validade ? new Date(data_validade) : undefined,
            imagem_url,
            verificado
        )];
    }
}