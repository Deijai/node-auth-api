// infrastructure/datasources/especialidade.datasource.impl.ts
import { EspecialidadeModel } from "../../data/mongodb";
import { CustomError } from "../../domain";
import { BuscarEspecialidadeResult, EspecialidadeDatasource } from "../../domain/datasources/especialidade.datasource";
import { AtualizarEspecialidadeDto } from "../../domain/dtos/especialidade/atualizar-especialidade.dto";
import { BuscarEspecialidadeDto } from "../../domain/dtos/especialidade/buscar-especialidade.dto";
import { CriarEspecialidadeDto } from "../../domain/dtos/especialidade/criar-especialidade.dto";
import { EspecialidadeEntity } from "../../domain/entities/especialidade.entity";
import { EspecialidadeMapper } from "../mappers/especialidade.mapper";

export class EspecialidadeDatasourceImpl implements EspecialidadeDatasource {

    async criar(criarEspecialidadeDto: CriarEspecialidadeDto, tenantId: string, userId: string): Promise<EspecialidadeEntity> {
        try {
            const especialidade = await EspecialidadeModel.create({
                tenant_id: tenantId,
                ...criarEspecialidadeDto,
                created_by: userId,
                updated_by: userId
            });

            return EspecialidadeMapper.especialidadeEntityFromObject(especialidade);
        } catch (error: any) {
            if (error.code === 11000) {
                if (error.keyPattern.nome) {
                    throw CustomError.badRequest('Nome da especialidade já existe');
                }
                if (error.keyPattern.codigo) {
                    throw CustomError.badRequest('Código da especialidade já existe');
                }
            }
            throw CustomError.internalServerError('Erro ao criar especialidade');
        }
    }

    async buscarPorId(id: string, tenantId: string): Promise<EspecialidadeEntity | null> {
        try {
            const especialidade = await EspecialidadeModel.findOne({ _id: id, tenant_id: tenantId });
            
            if (!especialidade) return null;
            return EspecialidadeMapper.especialidadeEntityFromObject(especialidade);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar especialidade');
        }
    }

    async buscarPorCodigo(codigo: string, tenantId: string): Promise<EspecialidadeEntity | null> {
        try {
            const especialidade = await EspecialidadeModel.findOne({ codigo, tenant_id: tenantId });
            
            if (!especialidade) return null;
            return EspecialidadeMapper.especialidadeEntityFromObject(especialidade);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar especialidade por código');
        }
    }

    async buscar(buscarEspecialidadeDto: BuscarEspecialidadeDto, tenantId: string): Promise<BuscarEspecialidadeResult> {
        try {
            const { page, limit, search, area_medica, ativa, requer_residencia } = buscarEspecialidadeDto;
            
            const query: any = { tenant_id: tenantId };

            if (search) {
                query.$or = [
                    { nome: { $regex: search, $options: 'i' } },
                    { codigo: { $regex: search, $options: 'i' } },
                    { descricao: { $regex: search, $options: 'i' } }
                ];
            }

            if (area_medica) query.area_medica = area_medica;
            if (ativa !== undefined) query.ativa = ativa;
            if (requer_residencia !== undefined) query.requer_residencia = requer_residencia;

            const [especialidades, total] = await Promise.all([
                EspecialidadeModel.find(query)
                    .sort({ nome: 1 })
                    .skip((page - 1) * limit)
                    .limit(limit),
                EspecialidadeModel.countDocuments(query)
            ]);

            const data = especialidades.map(esp => EspecialidadeMapper.especialidadeEntityFromObject(esp));

            return {
                data,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar especialidades');
        }
    }

    async buscarPorArea(area: string, tenantId: string): Promise<EspecialidadeEntity[]> {
        try {
            const especialidades = await EspecialidadeModel.find({ 
                area_medica: area, 
                tenant_id: tenantId,
                ativa: true 
            }).sort({ nome: 1 });

            return especialidades.map(esp => EspecialidadeMapper.especialidadeEntityFromObject(esp));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar especialidades por área');
        }
    }

    async buscarAtivas(tenantId: string): Promise<EspecialidadeEntity[]> {
        try {
            const especialidades = await EspecialidadeModel.find({ 
                tenant_id: tenantId,
                ativa: true 
            }).sort({ nome: 1 });

            return especialidades.map(esp => EspecialidadeMapper.especialidadeEntityFromObject(esp));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar especialidades ativas');
        }
    }

    async atualizar(id: string, atualizarEspecialidadeDto: AtualizarEspecialidadeDto, tenantId: string, userId: string): Promise<EspecialidadeEntity> {
        try {
            const especialidade = await EspecialidadeModel.findOneAndUpdate(
                { _id: id, tenant_id: tenantId },
                { 
                    ...atualizarEspecialidadeDto,
                    updated_by: userId,
                    updated_at: new Date()
                },
                { new: true }
            );

            if (!especialidade) {
                throw CustomError.notfound('Especialidade não encontrada');
            }

            return EspecialidadeMapper.especialidadeEntityFromObject(especialidade);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao atualizar especialidade');
        }
    }

    async ativar(id: string, tenantId: string, userId: string): Promise<boolean> {
        try {
            const result = await EspecialidadeModel.updateOne(
                { _id: id, tenant_id: tenantId },
                { 
                    ativa: true,
                    updated_by: userId,
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao ativar especialidade');
        }
    }

    async desativar(id: string, tenantId: string, userId: string): Promise<boolean> {
        try {
            const result = await EspecialidadeModel.updateOne(
                { _id: id, tenant_id: tenantId },
                { 
                    ativa: false,
                    updated_by: userId,
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao desativar especialidade');
        }
    }

    async deletar(id: string, tenantId: string): Promise<boolean> {
        try {
            const result = await EspecialidadeModel.deleteOne({ _id: id, tenant_id: tenantId });
            return result.deletedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao deletar especialidade');
        }
    }
}