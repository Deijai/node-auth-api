// domain/use-cases/documento/verificar-documento.use-case.ts
import { DocumentoRepository } from '../../repositories/documento.repository';
import { CustomError } from '../../errors/custom.error';

interface VerificarDocumentoUseCase {
    execute(id: string, tenantId: string, userId: string): Promise<boolean>;
}

export class VerificarDocumento implements VerificarDocumentoUseCase {
    constructor(private readonly documentoRepository: DocumentoRepository) {}

    async execute(id: string, tenantId: string, userId: string): Promise<boolean> {
        // Verificar se documento existe
        const documento = await this.documentoRepository.buscarPorId(id, tenantId);
        if (!documento) {
            throw CustomError.notfound('Documento não encontrado');
        }

        return await this.documentoRepository.verificarDocumento(id, tenantId, userId);
    }
}