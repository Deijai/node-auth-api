// domain/datasources/documento.datasource.ts

import { AtualizarDocumentoDto } from "../dtos/documento/atualizar-documento.dto";
import { BuscarDocumentoDto } from "../dtos/documento/buscar-documento.dto";
import { CriarDocumentoDto } from "../dtos/documento/criar-documento.dto";
import { DocumentoEntity } from "../entities/documento.entity";

export interface BuscarDocumentoResult {
    data: DocumentoEntity[];
    total: number;
    page: number;
    totalPages: number;
}

export abstract class DocumentoDatasource {
    abstract criar(criarDocumentoDto: CriarDocumentoDto, tenantId: string, userId: string): Promise<DocumentoEntity>;
    abstract buscarPorId(id: string, tenantId: string): Promise<DocumentoEntity | null>;
    abstract buscarPorPessoa(pessoaId: string, tenantId: string): Promise<DocumentoEntity[]>;
    abstract buscarPorTipo(pessoaId: string, tipo: string, tenantId: string): Promise<DocumentoEntity | null>;
    abstract buscar(buscarDocumentoDto: BuscarDocumentoDto, tenantId: string): Promise<BuscarDocumentoResult>;
    abstract buscarVencendo(tenantId: string, dias?: number): Promise<DocumentoEntity[]>;
    abstract atualizar(id: string, atualizarDocumentoDto: AtualizarDocumentoDto, tenantId: string, userId: string): Promise<DocumentoEntity>;
    abstract verificarDocumento(id: string, tenantId: string, userId: string): Promise<boolean>;
    abstract deletar(id: string, tenantId: string): Promise<boolean>;
}