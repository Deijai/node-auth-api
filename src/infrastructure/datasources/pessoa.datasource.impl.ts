// infrastructure/datasources/pessoa.datasource.impl.ts
import { PessoaModel } from "../../data/mongodb";
import { 
    CriarPessoaDto, AtualizarPessoaDto, 
    BuscarPessoaDto, PessoaEntity, CustomError 
} from "../../domain";
import { BuscarPessoaResult, PessoaDatasource } from "../../domain/datasources/pessoa.datasource";
import { PessoaMapper } from "../mappers/pessoa.mapper";

export class PessoaDatasourceImpl implements PessoaDatasource {

    async criar(criarPessoaDto: CriarPessoaDto, tenantId: string, userId: string): Promise<PessoaEntity> {
        try {
            const pessoa = await PessoaModel.create({
                tenant_id: tenantId,
                ...criarPessoaDto,
                created_by: userId,
                updated_by: userId
            });

            return PessoaMapper.pessoaEntityFromObject(pessoa);
        } catch (error: any) {
            if (error.code === 11000) {
                throw CustomError.badRequest('CPF já cadastrado neste município');
            }
            throw CustomError.internalServerError('Erro ao criar pessoa');
        }
    }

    async buscarPorId(id: string, tenantId: string): Promise<PessoaEntity | null> {
        try {
            const pessoa = await PessoaModel.findOne({ _id: id, tenant_id: tenantId });
            if (!pessoa) return null;

            return PessoaMapper.pessoaEntityFromObject(pessoa);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar pessoa');
        }
    }

    async buscarPorCpf(cpf: string, tenantId: string): Promise<PessoaEntity | null> {
        try {
            const pessoa = await PessoaModel.findOne({ cpf, tenant_id: tenantId });
            if (!pessoa) return null;

            return PessoaMapper.pessoaEntityFromObject(pessoa);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar pessoa por CPF');
        }
    }

    async buscar(buscarPessoaDto: BuscarPessoaDto, tenantId: string): Promise<BuscarPessoaResult> {
        try {
            const { page, limit, search, sexo, status, cidade, estado } = buscarPessoaDto;
            
            const query: any = { tenant_id: tenantId };

            if (search) {
                const cpfLimpo = search.replace(/\D/g, '');
                query.$or = [
                    { nome: { $regex: search, $options: 'i' } },
                    { cpf: { $regex: cpfLimpo } }
                ];
            }

            if (sexo) query.sexo = sexo;
            if (status) query.status = status;
            if (cidade) query['endereco.cidade'] = { $regex: cidade, $options: 'i' };
            if (estado) query['endereco.estado'] = { $regex: estado, $options: 'i' };

            const [pessoas, total] = await Promise.all([
                PessoaModel.find(query)
                    .sort({ created_at: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit),
                PessoaModel.countDocuments(query)
            ]);

            const data = pessoas.map(pessoa => PessoaMapper.pessoaEntityFromObject(pessoa));

            return {
                data,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar pessoas');
        }
    }

    async atualizar(id: string, atualizarPessoaDto: AtualizarPessoaDto, tenantId: string, userId: string): Promise<PessoaEntity> {
        try {
            const pessoa = await PessoaModel.findOneAndUpdate(
                { _id: id, tenant_id: tenantId },
                { 
                    ...atualizarPessoaDto,
                    updated_by: userId,
                    updated_at: new Date()
                },
                { new: true }
            );

            if (!pessoa) {
                throw CustomError.notfound('Pessoa não encontrada');
            }

            return PessoaMapper.pessoaEntityFromObject(pessoa);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao atualizar pessoa');
        }
    }

    async deletar(id: string, tenantId: string): Promise<boolean> {
        try {
            const result = await PessoaModel.deleteOne({ _id: id, tenant_id: tenantId });
            return result.deletedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao deletar pessoa');
        }
    }
}