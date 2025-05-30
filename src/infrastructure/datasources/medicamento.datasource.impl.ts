// infrastructure/datasources/medicamento.datasource.impl.ts
import { MedicamentoModel } from "../../data/mongodb";
import { CustomError } from "../../domain";
import { BuscarMedicamentoResult, MedicamentoDatasource } from "../../domain/datasources/medicamento.datasource";
import { AtualizarMedicamentoDto } from "../../domain/dtos/medicamento/atualizar-medicamento.dto";
import { BuscarMedicamentoDto } from "../../domain/dtos/medicamento/buscar-medicamento.dto";
import { CriarMedicamentoDto } from "../../domain/dtos/medicamento/criar-medicamento.dto";
import { MedicamentoEntity } from "../../domain/entities/medicamento.entity";
import { MedicamentoMapper } from "../mappers/medicamento.mapper";

export class MedicamentoDatasourceImpl implements MedicamentoDatasource {

    async criar(criarMedicamentoDto: CriarMedicamentoDto, tenantId: string, userId: string): Promise<MedicamentoEntity> {
        try {
            const medicamento = await MedicamentoModel.create({
                tenant_id: tenantId,
                ...criarMedicamentoDto,
                created_by: userId,
                updated_by: userId
            });

            return MedicamentoMapper.medicamentoEntityFromObject(medicamento);
        } catch (error: any) {
            if (error.code === 11000) {
                if (error.keyPattern.codigo_ean) {
                    throw CustomError.badRequest('Código EAN já existe');
                }
            }
            throw CustomError.internalServerError('Erro ao criar medicamento');
        }
    }

    async buscarPorId(id: string, tenantId: string): Promise<MedicamentoEntity | null> {
        try {
            const medicamento = await MedicamentoModel.findOne({ _id: id, tenant_id: tenantId });
            
            if (!medicamento) return null;
            return MedicamentoMapper.medicamentoEntityFromObject(medicamento);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar medicamento');
        }
    }

    async buscarPorCodigoEan(codigoEan: string, tenantId: string): Promise<MedicamentoEntity | null> {
        try {
            const medicamento = await MedicamentoModel.findOne({ codigo_ean: codigoEan, tenant_id: tenantId });
            
            if (!medicamento) return null;
            return MedicamentoMapper.medicamentoEntityFromObject(medicamento);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar medicamento por código EAN');
        }
    }

    async buscar(buscarMedicamentoDto: BuscarMedicamentoDto, tenantId: string): Promise<BuscarMedicamentoResult> {
        try {
            const { page, limit, search, forma_farmaceutica, via_administracao, controlado, disponivel_sus, ativo, classe_terapeutica } = buscarMedicamentoDto;
            
            const query: any = { tenant_id: tenantId };

            if (search) {
                query.$or = [
                    { nome_comercial: { $regex: search, $options: 'i' } },
                    { nome_generico: { $regex: search, $options: 'i' } },
                    { principio_ativo: { $regex: search, $options: 'i' } },
                    { codigo_ean: { $regex: search } }
                ];
            }

            if (forma_farmaceutica) query.forma_farmaceutica = forma_farmaceutica;
            if (via_administracao) query.via_administracao = via_administracao;
            if (controlado !== undefined) query.controlado = controlado;
            if (disponivel_sus !== undefined) query.disponivel_sus = disponivel_sus;
            if (ativo !== undefined) query.ativo = ativo;
            if (classe_terapeutica) query.classe_terapeutica = { $regex: classe_terapeutica, $options: 'i' };

            const [medicamentos, total] = await Promise.all([
                MedicamentoModel.find(query)
                    .sort({ nome_comercial: 1 })
                    .skip((page - 1) * limit)
                    .limit(limit),
                MedicamentoModel.countDocuments(query)
            ]);

            const data = medicamentos.map(med => MedicamentoMapper.medicamentoEntityFromObject(med));

            return {
                data,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar medicamentos');
        }
    }

    async buscarControlados(tenantId: string): Promise<MedicamentoEntity[]> {
        try {
            const medicamentos = await MedicamentoModel.find({ 
                tenant_id: tenantId,
                controlado: true,
                ativo: true 
            }).sort({ nome_comercial: 1 });

            return medicamentos.map(med => MedicamentoMapper.medicamentoEntityFromObject(med));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar medicamentos controlados');
        }
    }

    async buscarDisponivelSus(tenantId: string): Promise<MedicamentoEntity[]> {
        try {
            const medicamentos = await MedicamentoModel.find({ 
                tenant_id: tenantId,
                disponivel_sus: true,
                ativo: true 
            }).sort({ nome_comercial: 1 });

            return medicamentos.map(med => MedicamentoMapper.medicamentoEntityFromObject(med));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar medicamentos disponíveis no SUS');
        }
    }

    async buscarAtivos(tenantId: string): Promise<MedicamentoEntity[]> {
        try {
            const medicamentos = await MedicamentoModel.find({ 
                tenant_id: tenantId,
                ativo: true 
            }).sort({ nome_comercial: 1 });

            return medicamentos.map(med => MedicamentoMapper.medicamentoEntityFromObject(med));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar medicamentos ativos');
        }
    }

    async atualizar(id: string, atualizarMedicamentoDto: AtualizarMedicamentoDto, tenantId: string, userId: string): Promise<MedicamentoEntity> {
        try {
            const medicamento = await MedicamentoModel.findOneAndUpdate(
                { _id: id, tenant_id: tenantId },
                { 
                    ...atualizarMedicamentoDto,
                    updated_by: userId,
                    updated_at: new Date()
                },
                { new: true }
            );

            if (!medicamento) {
                throw CustomError.notfound('Medicamento não encontrado');
            }

            return MedicamentoMapper.medicamentoEntityFromObject(medicamento);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao atualizar medicamento');
        }
    }

    async ativar(id: string, tenantId: string, userId: string): Promise<boolean> {
        try {
            const result = await MedicamentoModel.updateOne(
                { _id: id, tenant_id: tenantId },
                { 
                    ativo: true,
                    updated_by: userId,
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao ativar medicamento');
        }
    }

    async desativar(id: string, tenantId: string, userId: string): Promise<boolean> {
        try {
            const result = await MedicamentoModel.updateOne(
                { _id: id, tenant_id: tenantId },
                { 
                    ativo: false,
                    updated_by: userId,
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao desativar medicamento');
        }
    }

    async deletar(id: string, tenantId: string): Promise<boolean> {
        try {
            const result = await MedicamentoModel.deleteOne({ _id: id, tenant_id: tenantId });
            return result.deletedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao deletar medicamento');
        }
    }
}