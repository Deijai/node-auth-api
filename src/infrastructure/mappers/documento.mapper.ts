// infrastructure/mappers/documento.mapper.ts
import { CustomError } from "../../domain";
import { DocumentoEntity } from "../../domain/entities/documento.entity";

export class DocumentoMapper {
    static documentoEntityFromObject(object: { [key: string]: any }): DocumentoEntity {
        const { 
            id, _id, tenant_id, pessoa_id, tipo, numero, orgao_emissor,
            data_emissao, data_validade, imagem_url, verificado,
            created_at, updated_at, created_by, updated_by, pessoa
        } = object;

        if (!_id && !id) throw CustomError.badRequest('ID obrigatório');
        if (!tenant_id) throw CustomError.badRequest('Tenant ID obrigatório');
        if (!pessoa_id) throw CustomError.badRequest('ID da pessoa obrigatório');
        if (!tipo) throw CustomError.badRequest('Tipo do documento obrigatório');
        if (!numero) throw CustomError.badRequest('Número do documento obrigatório');

        return new DocumentoEntity(
            _id || id,
            tenant_id,
            pessoa_id,
            tipo,
            numero,
            orgao_emissor,
            data_emissao,
            data_validade,
            imagem_url,
            verificado || false,
            created_at,
            updated_at,
            created_by,
            updated_by,
            pessoa
        );
    }
}