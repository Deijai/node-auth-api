// presentation/controllers/documento.controller.ts
import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { AtualizarDocumentoDto } from '../../domain/dtos/documento/atualizar-documento.dto';
import { BuscarDocumentoDto } from '../../domain/dtos/documento/buscar-documento.dto';
import { CriarDocumentoDto } from '../../domain/dtos/documento/criar-documento.dto';
import { DocumentoRepository } from '../../domain/repositories/documento.repository';
import { PessoaRepository } from '../../domain/repositories/pessoa.repository';
import { VerificarDocumento } from '../../domain/use-cases/documento/verificar-documento.use-case';
import { CriarDocumento } from '../../domain/use-cases/documento/criar-documento.use-case';

export class DocumentoController {
    constructor(
        private readonly documentoRepository: DocumentoRepository,
        private readonly pessoaRepository: PessoaRepository
    ) {}

    // CORREÇÃO: Método para criar documento
    criarDocumento = (req: Request, res: Response): void => {
        const [error, criarDocumentoDto] = CriarDocumentoDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new CriarDocumento(this.documentoRepository, this.pessoaRepository)
            .execute(criarDocumentoDto!, tenantId, userId)
            .then(documento => res.status(201).json(documento))
            .catch(error => this.handleError(error, res));
    };

    // CORREÇÃO: Método que estava faltando - buscarDocumentos
    buscarDocumentos = (req: Request, res: Response): void => {
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

    buscarDocumentoPorId = (req: Request, res: Response): void => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.documentoRepository.buscarPorId(id, tenantId)
            .then(documento => {
                if (!documento) {
                    res.status(404).json({ error: 'Documento não encontrado' });
                    return;
                }
                res.json(documento);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarDocumentosPorPessoa = (req: Request, res: Response): void => {
        const { pessoaId } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.documentoRepository.buscarPorPessoa(pessoaId, tenantId)
            .then(documentos => res.json(documentos))
            .catch(error => this.handleError(error, res));
    };

    buscarDocumentosVencendo = (req: Request, res: Response): void => {
        const { dias } = req.query;
        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const diasNum = dias ? parseInt(dias as string) : 30;

        this.documentoRepository.buscarVencendo(tenantId, diasNum)
            .then(documentos => res.json(documentos))
            .catch(error => this.handleError(error, res));
    };

    atualizarDocumento = (req: Request, res: Response): void => {
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

    verificarDocumento = (req: Request, res: Response): void => {
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

    deletarDocumento = (req: Request, res: Response): void => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.documentoRepository.deletar(id, tenantId)
            .then(deletado => {
                if (!deletado) {
                    res.status(404).json({ error: 'Documento não encontrado' });
                    return;
                }
                res.json({ message: 'Documento deletado com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    private handleError = (error: unknown, res: Response): void => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        console.error('Erro documento controller:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    };
}

// ========================================
// VERSÃO ASYNC/AWAIT (Alternativa mais limpa)
// ========================================

export class DocumentoControllerAsync {
    constructor(
        private readonly documentoRepository: DocumentoRepository,
        private readonly pessoaRepository: PessoaRepository
    ) {}

    criarDocumento = async (req: Request, res: Response): Promise<void> => {
        try {
            const [error, criarDocumentoDto] = CriarDocumentoDto.create(req.body);
            if (error) {
                res.status(400).json({ error });
                return;
            }

            const tenantId = req.body.tenant?.id || req.body.tenantId;
            const userId = req.body.user?.id || req.body.userId;

            const documento = await new CriarDocumento(this.documentoRepository, this.pessoaRepository)
                .execute(criarDocumentoDto!, tenantId, userId);

            res.status(201).json(documento);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    buscarDocumentos = async (req: Request, res: Response): Promise<void> => {
        try {
            const [error, buscarDocumentoDto] = BuscarDocumentoDto.create(req.query);
            if (error) {
                res.status(400).json({ error });
                return;
            }

            const tenantId = req.body.tenant?.id || req.body.tenantId;
            const resultado = await this.documentoRepository.buscar(buscarDocumentoDto!, tenantId);
            
            res.json(resultado);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    buscarDocumentoPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const tenantId = req.body.tenant?.id || req.body.tenantId;

            const documento = await this.documentoRepository.buscarPorId(id, tenantId);
            if (!documento) {
                res.status(404).json({ error: 'Documento não encontrado' });
                return;
            }
            
            res.json(documento);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    verificarDocumento = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const tenantId = req.body.tenant?.id || req.body.tenantId;
            const userId = req.body.user?.id || req.body.userId;

            const sucesso = await new VerificarDocumento(this.documentoRepository)
                .execute(id, tenantId, userId);
            
            if (sucesso) {
                res.json({ message: 'Documento verificado com sucesso' });
            } else {
                res.status(400).json({ error: 'Erro ao verificar documento' });
            }
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError = (error: unknown, res: Response): void => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        console.error('Erro documento controller:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    };
}