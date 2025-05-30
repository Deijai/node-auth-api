// domain/dtos/documento/criar-documento.dto.ts
import { Validators } from '../../../config/validators';

export class CriarDocumentoDto {
    private constructor(
        public pessoa_id: string,
        public tipo: 'RG' | 'CPF' | 'CNH' | 'PASSAPORTE' | 'CERTIDAO_NASCIMENTO' | 'OUTROS',
        public numero: string,
        public orgao_emissor?: string,
        public data_emissao?: Date,
        public data_validade?: Date,
        public imagem_url?: string
    ) {}

    static create(object: { [key: string]: any }): [string?, CriarDocumentoDto?] {
        const { 
            pessoa_id, tipo, numero, orgao_emissor, data_emissao, 
            data_validade, imagem_url 
        } = object;

        if (!pessoa_id) return ['ID da pessoa é obrigatório'];
        if (!Validators.mongoId.test(pessoa_id)) return ['ID da pessoa inválido'];

        if (!tipo) return ['Tipo do documento é obrigatório'];
        const tiposValidos = ['RG', 'CPF', 'CNH', 'PASSAPORTE', 'CERTIDAO_NASCIMENTO', 'OUTROS'];
        if (!tiposValidos.includes(tipo)) {
            return ['Tipo de documento inválido'];
        }

        if (!numero) return ['Número do documento é obrigatório'];
        if (numero.length > 50) return ['Número do documento não pode exceder 50 caracteres'];

        // Validações específicas por tipo
        const numeroLimpo = numero.replace(/\D/g, '');
        
        if (tipo === 'CPF' && !Validators.cpf.test(numeroLimpo)) {
            return ['CPF inválido'];
        }

        if (tipo === 'CNH' && numeroLimpo.length !== 11) {
            return ['CNH deve ter 11 dígitos'];
        }

        if (orgao_emissor && orgao_emissor.length > 100) {
            return ['Órgão emissor não pode exceder 100 caracteres'];
        }

        if (data_emissao) {
            const dataEmis = new Date(data_emissao);
            if (isNaN(dataEmis.getTime())) return ['Data de emissão inválida'];
            if (dataEmis > new Date()) return ['Data de emissão não pode ser futura'];
        }

        if (data_validade) {
            const dataVal = new Date(data_validade);
            if (isNaN(dataVal.getTime())) return ['Data de validade inválida'];
            if (data_emissao && dataVal <= new Date(data_emissao)) {
                return ['Data de validade deve ser posterior à data de emissão'];
            }
        }

        if (imagem_url && !Validators.url.test(imagem_url)) {
            return ['URL da imagem inválida'];
        }

        return [undefined, new CriarDocumentoDto(
            pessoa_id,
            tipo,
            numero.replace(/\D/g, ''), // Salvar apenas números
            orgao_emissor?.trim(),
            data_emissao ? new Date(data_emissao) : undefined,
            data_validade ? new Date(data_validade) : undefined,
            imagem_url
        )];
    }
}