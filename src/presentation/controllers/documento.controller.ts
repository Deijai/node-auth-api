// presentation/controllers/documento.controller.ts
import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { AtualizarDocumentoDto } from '../../domain/dtos/documento/atualizar-documento.dto';
import { BuscarDocumentoDto } from '../../domain/dtos/documento/buscar-documento.dto';
import { DocumentoRepository } from '../../domain/repositories/documento.repository';
import { PessoaRepository } from '../../domain/repositories/pessoa.repository';
import { VerificarDocumento } from '../../domain/use-cases/documento/verificar-documento.use-case';

export class DocumentoController {
    constructor(
        private readonly documentoRepository: DocumentoRepository,
        private readonly pessoaRepository: PessoaRepository
    ) {}

    criarDocumento = (req: Request, res: Response) => {
        const [error, buscarDocumentoDto] = BuscarDocumentoDto.create(req.query);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.documentoRepository.buscar(buscarDocumentoDto!, tenantId)
            .then(resultado => res.json(resultado))
            .catch(error => this.handleError(error, res));
    };

    buscarDocumentoPorId = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.documentoRepository.buscarPorId(id, tenantId)
            .then(documento => {
                if (!documento) {
                    return res.status(404).json({ error: 'Documento não encontrado' });
                }
                res.json(documento);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarDocumentosPorPessoa = (req: Request, res: Response) => {
        const { pessoaId } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.documentoRepository.buscarPorPessoa(pessoaId, tenantId)
            .then(documentos => res.json(documentos))
            .catch(error => this.handleError(error, res));
    };

    buscarDocumentosVencendo = (req: Request, res: Response) => {
        const { dias } = req.query;
        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const diasNum = dias ? parseInt(dias as string) : 30;

        this.documentoRepository.buscarVencendo(tenantId, diasNum)
            .then(documentos => res.json(documentos))
            .catch(error => this.handleError(error, res));
    };

    atualizarDocumento = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, atualizarDocumentoDto] = AtualizarDocumentoDto.create(req.body);
        
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        this.documentoRepository.atualizar(id, atualizarDocumentoDto!, tenantId, userId)
            .then(documento => res.json(documento))
            .catch(error => this.handleError(error, res));
    };

    verificarDocumento = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new VerificarDocumento(this.documentoRepository)
            .execute(id, tenantId, userId)
            .then(sucesso => {
                if (sucesso) {
                    res.json({ message: 'Documento verificado com sucesso' });
                } else {
                    res.status(400).json({ error: 'Erro ao verificar documento' });
                }
            })
            .catch(error => this.handleError(error, res));
    };

    deletarDocumento = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.documentoRepository.deletar(id, tenantId)
            .then(deletado => {
                if (!deletado) {
                    return res.status(404).json({ error: 'Documento não encontrado' });
                }
                res.json({ message: 'Documento deletado com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error('Erro documento controller:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    };
}