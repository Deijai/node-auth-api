// infrastructure/datasources/unidade.datasource.impl.ts
import { UnidadeModel, ConsultaModel, PacienteModel } from "../../data/mongodb";
import { CustomError } from "../../domain";
import { BuscarUnidadeResult, EstatisticasUnidade, UnidadeDatasource } from "../../domain/datasources/unidade.datasource";
import { AtualizarUnidadeDto } from "../../domain/dtos/unidade/atualizar-unidade.dto";
import { BuscarUnidadeDto } from "../../domain/dtos/unidade/buscar-unidade.dto";
import { CriarUnidadeDto } from "../../domain/dtos/unidade/criar-unidade.dto";
import { UnidadeEntity } from "../../domain/entities/unidade.entity";
import { UnidadeMapper } from "../mappers/unidade.mapper";

export class UnidadeDatasourceImpl implements UnidadeDatasource {

    async criar(criarUnidadeDto: CriarUnidadeDto, tenantId: string, userId: string): Promise<UnidadeEntity> {
        try {
            const unidade = await UnidadeModel.create({
                tenant_id: tenantId,
                ...criarUnidadeDto,
                created_by: userId,
                updated_by: userId
            });

            const unidadePopulada = await UnidadeModel.findById(unidade._id)
                .populate('gestor_responsavel', 'usuario pessoa_id');
            
            return UnidadeMapper.unidadeEntityFromObject(unidadePopulada!);
        } catch (error: any) {
            if (error.code === 11000) {
                if (error.keyPattern.cnes) {
                    throw CustomError.badRequest('CNES já cadastrado neste município');
                }
            }
            throw CustomError.internalServerError('Erro ao criar unidade');
        }
    }

    async buscarPorId(id: string, tenantId: string): Promise<UnidadeEntity | null> {
        try {
            const unidade = await UnidadeModel.findOne({ _id: id, tenant_id: tenantId })
                .populate('gestor_responsavel', 'usuario pessoa_id');
            
            if (!unidade) return null;
            return UnidadeMapper.unidadeEntityFromObject(unidade);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar unidade');
        }
    }

    async buscarPorCnes(cnes: string, tenantId: string): Promise<UnidadeEntity | null> {
        try {
            const unidade = await UnidadeModel.findOne({ cnes, tenant_id: tenantId });
            
            if (!unidade) return null;
            return UnidadeMapper.unidadeEntityFromObject(unidade);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar unidade por CNES');
        }
    }

    async buscar(buscarUnidadeDto: BuscarUnidadeDto, tenantId: string): Promise<BuscarUnidadeResult> {
        try {
            const { page, limit, search, tipo, cidade, especialidade, funcionando_agora } = buscarUnidadeDto;
            
            const query: any = { tenant_id: tenantId };

            if (search) {
                query.$or = [
                    { nome: { $regex: search, $options: 'i' } },
                    { cnes: { $regex: search } }
                ];
            }

            if (tipo) query.tipo = tipo;
            if (cidade) query['endereco.cidade'] = { $regex: cidade, $options: 'i' };
            if (especialidade) {
                query['especialidades.nome'] = { $regex: especialidade, $options: 'i' };
                query['especialidades.ativa'] = true;
            }

            // Filtro funcionando agora seria mais complexo, requer lógica de horário
            if (funcionando_agora) {
                const agora = new Date();
                const diaSemana = agora.getDay();
                const horaAtual = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
                
                query.$or = [
                    { 'horario_funcionamento.funciona_24h': true },
                    {
                        $and: [
                            { 'horario_funcionamento.dia_semana': diaSemana },
                            { 'horario_funcionamento.hora_abertura': { $lte: horaAtual } },
                            { 'horario_funcionamento.hora_fechamento': { $gte: horaAtual } }
                        ]
                    }
                ];
            }

            const [unidades, total] = await Promise.all([
                UnidadeModel.find(query)
                    .populate('gestor_responsavel', 'usuario')
                    .sort({ nome: 1 })
                    .skip((page - 1) * limit)
                    .limit(limit),
                UnidadeModel.countDocuments(query)
            ]);

            const data = unidades.map(unidade => UnidadeMapper.unidadeEntityFromObject(unidade));

            return {
                data,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar unidades');
        }
    }

    async buscarPorTipo(tipo: string, tenantId: string): Promise<UnidadeEntity[]> {
        try {
            const unidades = await UnidadeModel.find({ tipo, tenant_id: tenantId })
                .sort({ nome: 1 });

            return unidades.map(unidade => UnidadeMapper.unidadeEntityFromObject(unidade));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar unidades por tipo');
        }
    }

    async buscarPorEspecialidade(especialidade: string, tenantId: string): Promise<UnidadeEntity[]> {
        try {
            const unidades = await UnidadeModel.find({
                tenant_id: tenantId,
                'especialidades.nome': { $regex: especialidade, $options: 'i' },
                'especialidades.ativa': true
            }).sort({ nome: 1 });

            return unidades.map(unidade => UnidadeMapper.unidadeEntityFromObject(unidade));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar unidades por especialidade');
        }
    }

    async buscarProximas(latitude: number, longitude: number, raioKm: number, tenantId: string): Promise<UnidadeEntity[]> {
        try {
            // Query usando geolocalização do MongoDB
            const unidades = await UnidadeModel.find({
                tenant_id: tenantId,
                'endereco.coordenadas': {
                    $geoWithin: {
                        $centerSphere: [[longitude, latitude], raioKm / 6371] // Raio da Terra em km
                    }
                }
            }).sort({ nome: 1 });

            return unidades.map(unidade => UnidadeMapper.unidadeEntityFromObject(unidade));
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar unidades próximas');
        }
    }

    async obterEstatisticas(id: string, tenantId: string): Promise<EstatisticasUnidade> {
        try {
            const unidade = await UnidadeModel.findOne({ _id: id, tenant_id: tenantId });
            if (!unidade) {
                throw CustomError.notfound('Unidade não encontrada');
            }

            const inicioMes = new Date();
            inicioMes.setDate(1);
            inicioMes.setHours(0, 0, 0, 0);

            // Estatísticas básicas (seria implementado com consultas reais)
            const [totalAtendimentos, totalPacientes] = await Promise.all([
                ConsultaModel?.countDocuments({
                    tenant_id: tenantId,
                    unidade_id: id,
                    data_hora_agendada: { $gte: inicioMes }
                }) || 0,
                PacienteModel?.countDocuments({ tenant_id: tenantId }) || 0
            ]);

            const especialidadesAtivas = unidade.especialidades?.filter(esp => esp.ativa).length || 0;
            const equipamentosFuncionando = unidade.equipamentos?.filter(eq => eq.status === 'FUNCIONANDO').length || 0;
            const equipamentosManutencao = unidade.equipamentos?.filter(eq => eq.status === 'MANUTENCAO').length || 0;

            return {
                total_atendimentos_mes: totalAtendimentos,
                total_pacientes_unicos: totalPacientes,
                especialidades_ativas: especialidadesAtivas,
                ocupacao_leitos: 0, // Seria calculado com base em internações
                equipamentos_funcionando: equipamentosFuncionando,
                equipamentos_manutencao: equipamentosManutencao
            };
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao obter estatísticas da unidade');
        }
    }

    async atualizar(id: string, atualizarUnidadeDto: AtualizarUnidadeDto, tenantId: string, userId: string): Promise<UnidadeEntity> {
        try {
            const unidade = await UnidadeModel.findOneAndUpdate(
                { _id: id, tenant_id: tenantId },
                { 
                    ...atualizarUnidadeDto,
                    updated_by: userId,
                    updated_at: new Date()
                },
                { new: true }
            ).populate('gestor_responsavel', 'usuario');

            if (!unidade) {
                throw CustomError.notfound('Unidade não encontrada');
            }

            return UnidadeMapper.unidadeEntityFromObject(unidade);
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            if (error.code === 11000 && error.keyPattern.cnes) {
                throw CustomError.badRequest('CNES já cadastrado para outra unidade');
            }
            throw CustomError.internalServerError('Erro ao atualizar unidade');
        }
    }

    async deletar(id: string, tenantId: string): Promise<boolean> {
        try {
            const result = await UnidadeModel.deleteOne({ _id: id, tenant_id: tenantId });
            return result.deletedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao deletar unidade');
        }
    }
}