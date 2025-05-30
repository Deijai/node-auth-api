// infrastructure/datasources/documento.datasource.impl.ts
import { DocumentoModel, PessoaModel } from "../../data/mongodb";
import { CustomError } from "../../domain";
import { BuscarDocumentoResult, DocumentoDatasource } from "../../domain/datasources/documento.datasource";
import { AtualizarDocumentoDto } from "../../domain/dtos/documento/atualizar-documento.dto";
import { BuscarDocumentoDto } from "../../domain/dtos/documento/buscar-documento.dto";
import { CriarDocumentoDto } from "../../domain/dtos/documento/criar-documento.dto";
import { DocumentoEntity } from "../../domain/entities/documento.entity";
import { DocumentoMapper } from "../mappers/documento.mapper";

export class DocumentoDatasourceImpl implements DocumentoDatasource {

    async criar(criarDocumentoDto: CriarDocumentoDto, tenantId: string, userId: string): Promise<DocumentoEntity> {
        try {
            const documento = await DocumentoModel.create({
                tenant_id: tenantId,
                ...criarDocumentoDto,
                created_by: userId,
                updated_by: userId
            });

            const documentoPopulado = await DocumentoModel.findById(documento._id).populate('pessoa_id', 'nome cpf');
            return DocumentoMapper.documentoEntityFromObject(documentoPopulado!);
        } catch (error: any) {
            if (error.code === 11000) {
                throw CustomError.badRequest('Já existe um documento deste tipo para esta pessoa');
            }
            throw CustomError.internalServerError('Erro ao criar documento');
        }
    }

    async buscarPorId(id: string, tenantId: string): Promise<DocumentoEntity | null> {
        try {
            const documento = await DocumentoModel.findOne({ _id: id, tenant_id: tenantId })
                .populate('pessoa_id', 'nome cpf');
            
            if (!documento) return null;
            return DocumentoMapper.documentoEntityFromObject(documento);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar documento');
        }
    }

    async buscarPorPessoa(pessoaId: string, tenantId: string): Promise<DocumentoEntity[]> {
        try {
            const documentos = await DocumentoModel.find({ pessoa_id: pessoaId, tenant_id: tenantId })
                .populate('pessoa_id', 'nome cpf')
                .sort({ created_at: -1 });

            return documentos.map(doc => DocumentoMapper.documentoEntityFromObject(doc));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar documentos da pessoa');
        }
    }

    async buscarPorTipo(pessoaId: string, tipo: string, tenantId: string): Promise<DocumentoEntity | null> {
        try {
            const documento = await DocumentoModel.findOne({ 
                pessoa_id: pessoaId, 
                tipo, 
                tenant_id: tenantId 
            }).populate('pessoa_id', 'nome cpf');
            
            if (!documento) return null;
            return DocumentoMapper.documentoEntityFromObject(documento);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar documento por tipo');
        }
    }

    async buscar(buscarDocumentoDto: BuscarDocumentoDto, tenantId: string): Promise<BuscarDocumentoResult> {
        try {
            const { page, limit, pessoa_id, tipo, verificado, vencendo } = buscarDocumentoDto;
            
            const query: any = { tenant_id: tenantId };

            if (pessoa_id) query.pessoa_id = pessoa_id;
            if (tipo) query.tipo = tipo;
            if (verificado !== undefined) query.verificado = verificado;
            
            if (vencendo) {
                const dataLimite = new Date();
                dataLimite.setDate(dataLimite.getDate() + 30);
                query.data_validade = {
                    $exists: true,
                    $lte: dataLimite,
                    $gte: new Date()
                };
            }

            const [documentos, total] = await Promise.all([
                DocumentoModel.find(query)
                    .populate('pessoa_id', 'nome cpf')
                    .sort({ created_at: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit),
                DocumentoModel.countDocuments(query)
            ]);

            const data = documentos.map(doc => DocumentoMapper.documentoEntityFromObject(doc));

            return {
                data,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar documentos');
        }
    }

    async buscarVencendo(tenantId: string, dias: number = 30): Promise<DocumentoEntity[]> {
        try {
            const dataLimite = new Date();
            dataLimite.setDate(dataLimite.getDate() + dias);

            const documentos = await DocumentoModel.find({
                tenant_id: tenantId,
                data_validade: {
                    $exists: true,
                    $lte: dataLimite,
                    $gte: new Date()
                }
            })
            .populate('pessoa_id', 'nome cpf')
            .sort({ data_validade: 1 });

            return documentos.map(doc => DocumentoMapper.documentoEntityFromObject(doc));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar documentos vencendo');
        }
    }

    async atualizar(id: string, atualizarDocumentoDto: AtualizarDocumentoDto, tenantId: string, userId: string): Promise<DocumentoEntity> {
        try {
            const documento = await DocumentoModel.findOneAndUpdate(
                { _id: id, tenant_id: tenantId },
                { 
                    ...atualizarDocumentoDto,
                    updated_by: userId,
                    updated_at: new Date()
                },
                { new: true }
            ).populate('pessoa_id', 'nome cpf');

            if (!documento) {
                throw CustomError.notfound('Documento não encontrado');
            }

            return DocumentoMapper.documentoEntityFromObject(documento);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao atualizar documento');
        }
    }

    async verificarDocumento(id: string, tenantId: string, userId: string): Promise<boolean> {
        try {
            const result = await DocumentoModel.updateOne(
                { _id: id, tenant_id: tenantId },
                { 
                    verificado: true,
                    updated_by: userId,
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao verificar documento');
        }
    }

    async deletar(id: string, tenantId: string): Promise<boolean> {
        try {
            const result = await DocumentoModel.deleteOne({ _id: id, tenant_id: tenantId });
            return result.deletedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao deletar documento');
        }
    }
}