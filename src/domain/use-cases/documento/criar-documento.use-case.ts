// domain/use-cases/documento/criar-documento.use-case.ts
import { DocumentoRepository } from '../../repositories/documento.repository';
import { PessoaRepository } from '../../repositories/pessoa.repository';
import { CriarDocumentoDto } from '../../dtos/documento/criar-documento.dto';
import { DocumentoEntity } from '../../entities/documento.entity';
import { CustomError } from '../../errors/custom.error';

interface CriarDocumentoUseCase {
    execute(criarDocumentoDto: CriarDocumentoDto, tenantId: string, userId: string): Promise<DocumentoEntity>;
}

export class CriarDocumento implements CriarDocumentoUseCase {
    constructor(
        private readonly documentoRepository: DocumentoRepository,
        private readonly pessoaRepository: PessoaRepository
    ) {}

    async execute(criarDocumentoDto: CriarDocumentoDto, tenantId: string, userId: string): Promise<DocumentoEntity> {
        // Verificar se pessoa existe
        const pessoa = await this.pessoaRepository.buscarPorId(criarDocumentoDto.pessoa_id, tenantId);
        if (!pessoa) {
            throw CustomError.badRequest('Pessoa não encontrada');
        }

        // Verificar se já existe documento do mesmo tipo para esta pessoa
        const documentoExistente = await this.documentoRepository.buscarPorTipo(
            criarDocumentoDto.pessoa_id, 
            criarDocumentoDto.tipo, 
            tenantId
        );
        if (documentoExistente) {
            throw CustomError.badRequest(`Já existe um documento do tipo ${criarDocumentoDto.tipo} para esta pessoa`);
        }

        return await this.documentoRepository.criar(criarDocumentoDto, tenantId, userId);
    }
}