// infrastructure/repositories/documento.repository.impl.ts
import { BuscarDocumentoResult, DocumentoDatasource } from "../../domain/datasources/documento.datasource";
import { AtualizarDocumentoDto } from "../../domain/dtos/documento/atualizar-documento.dto";
import { BuscarDocumentoDto } from "../../domain/dtos/documento/buscar-documento.dto";
import { CriarDocumentoDto } from "../../domain/dtos/documento/criar-documento.dto";
import { DocumentoEntity } from "../../domain/entities/documento.entity";
import { DocumentoRepository } from "../../domain/repositories/documento.repository";

export class DocumentoRepositoryImpl implements DocumentoRepository {
    constructor(private readonly documentoDatasource: DocumentoDatasource) {}

    criar(criarDocumentoDto: CriarDocumentoDto, tenantId: string, userId: string): Promise<DocumentoEntity> {
        return this.documentoDatasource.criar(criarDocumentoDto, tenantId, userId);
    }

    buscarPorId(id: string, tenantId: string): Promise<DocumentoEntity | null> {
        return this.documentoDatasource.buscarPorId(id, tenantId);
    }

    buscarPorPessoa(pessoaId: string, tenantId: string): Promise<DocumentoEntity[]> {
        return this.documentoDatasource.buscarPorPessoa(pessoaId, tenantId);
    }

    buscarPorTipo(pessoaId: string, tipo: string, tenantId: string): Promise<DocumentoEntity | null> {
        return this.documentoDatasource.buscarPorTipo(pessoaId, tipo, tenantId);
    }

    buscar(buscarDocumentoDto: BuscarDocumentoDto, tenantId: string): Promise<BuscarDocumentoResult> {
        return this.documentoDatasource.buscar(buscarDocumentoDto, tenantId);
    }

    buscarVencendo(tenantId: string, dias?: number): Promise<DocumentoEntity[]> {
        return this.documentoDatasource.buscarVencendo(tenantId, dias);
    }

    atualizar(id: string, atualizarDocumentoDto: AtualizarDocumentoDto, tenantId: string, userId: string): Promise<DocumentoEntity> {
        return this.documentoDatasource.atualizar(id, atualizarDocumentoDto, tenantId, userId);
    }

    verificarDocumento(id: string, tenantId: string, userId: string): Promise<boolean> {
        return this.documentoDatasource.verificarDocumento(id, tenantId, userId);
    }

    deletar(id: string, tenantId: string): Promise<boolean> {
        return this.documentoDatasource.deletar(id, tenantId);
    }
}