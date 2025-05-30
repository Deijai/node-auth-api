// infrastructure/datasources/tenant.datasource.impl.ts
import { TenantModel, UsuarioModel, PacienteModel, UnidadeModel, ConsultaModel } from "../../data/mongodb";
import { CustomError } from "../../domain";
import { BuscarTenantResult, EstatisticasTenant, TenantDatasource } from "../../domain/datasources/tenant.datasource";
import { AtualizarTenantDto } from "../../domain/dtos/tenant/atualizar-tenant.dto";
import { BuscarTenantDto } from "../../domain/dtos/tenant/buscar-tenant.dto";
import { ConfigurarTenantDto } from "../../domain/dtos/tenant/configurar-tenant.dto";
import { CriarTenantDto } from "../../domain/dtos/tenant/criar-tenant.dto";
import { TenantEntity } from "../../domain/entities/tenant.entity";
import { TenantMapper } from "../mappers/tenant.mapper";

export class TenantDatasourceImpl implements TenantDatasource {

    async criar(criarTenantDto: CriarTenantDto, userId: string): Promise<TenantEntity> {
        try {
            // Configurações padrão
            const configuracoesPadrao = {
                timezone: 'America/Sao_Paulo',
                cores_tema: {
                    primaria: '#0066CC',
                    secundaria: '#4A90E2',
                    acento: '#FF6B35'
                },
                modulos_ativos: ['UBS', 'SECRETARIA'],
                configuracoes_sistema: {
                    permite_agendamento_online: true,
                    antecedencia_maxima_agendamento: 30,
                    antecedencia_minima_agendamento: 2,
                    duracao_padrao_consulta: 30,
                    permite_reagendamento: true,
                    limite_reagendamentos: 3,
                    tempo_limite_cancelamento: 24,
                    notificacoes_ativas: true,
                    lembrete_antecedencia: 24
                },
                configuracoes_clinicas: {
                    usa_triagem_manchester: false,
                    obrigatorio_sinais_vitais: false,
                    obrigatorio_diagnostico_cid: false,
                    permite_prescricao_digital: true,
                    validade_receita_dias: 30,
                    requer_assinatura_digital: false
                },
                integracao: {
                    sus_integrado: false,
                    laboratorio_externo: false,
                    farmacia_popular: false,
                    telemedicina: false,
                    prontuario_eletronico: true
                }
            };

            // Limites padrão baseados no plano
            const limitePadrao = this.obterLimitesPorPlano(criarTenantDto.plano?.tipo || 'BASICO');

            // Plano padrão
            const planoPadrao = {
                tipo: criarTenantDto.plano?.tipo || 'BASICO',
                data_inicio: new Date(),
                valor_mensal: criarTenantDto.plano?.valor_mensal || this.obterValorPlano(criarTenantDto.plano?.tipo || 'BASICO'),
                status: 'ATIVO'
            };

            const tenant = await TenantModel.create({
                nome: criarTenantDto.nome,
                codigo: criarTenantDto.codigo,
                subdomain: criarTenantDto.subdomain,
                cnpj: criarTenantDto.cnpj,
                endereco: criarTenantDto.endereco,
                contato: criarTenantDto.contato,
                configuracoes: configuracoesPadrao,
                limites: limitePadrao,
                plano: planoPadrao,
                status: 'ATIVO',
                data_criacao: new Date(),
                created_by: userId,
                updated_by: userId
            });

            return TenantMapper.tenantEntityFromObject(tenant);
        } catch (error: any) {
            if (error.code === 11000) {
                if (error.keyPattern.codigo) {
                    throw CustomError.badRequest('Código já está em uso');
                }
                if (error.keyPattern.subdomain) {
                    throw CustomError.badRequest('Subdomínio já está em uso');
                }
                if (error.keyPattern.cnpj) {
                    throw CustomError.badRequest('CNPJ já está cadastrado');
                }
            }
            throw CustomError.internalServerError('Erro ao criar tenant');
        }
    }

    async buscarPorId(id: string): Promise<TenantEntity | null> {
        try {
            const tenant = await TenantModel.findById(id);
            if (!tenant) return null;
            
            return TenantMapper.tenantEntityFromObject(tenant);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar tenant');
        }
    }

    async buscarPorCodigo(codigo: string): Promise<TenantEntity | null> {
        try {
            const tenant = await TenantModel.findOne({ codigo });
            if (!tenant) return null;
            
            return TenantMapper.tenantEntityFromObject(tenant);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar tenant por código');
        }
    }

    async buscarPorSubdomain(subdomain: string): Promise<TenantEntity | null> {
        try {
            const tenant = await TenantModel.findOne({ subdomain });
            if (!tenant) return null;
            
            return TenantMapper.tenantEntityFromObject(tenant);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar tenant por subdomínio');
        }
    }

    async buscarPorCnpj(cnpj: string): Promise<TenantEntity | null> {
        try {
            const tenant = await TenantModel.findOne({ cnpj });
            if (!tenant) return null;
            
            return TenantMapper.tenantEntityFromObject(tenant);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar tenant por CNPJ');
        }
    }

    async buscar(buscarTenantDto: BuscarTenantDto): Promise<BuscarTenantResult> {
        try {
            const { page, limit, search, status, plano, estado } = buscarTenantDto;
            
            const query: any = {};

            if (search) {
                query.$or = [
                    { nome: { $regex: search, $options: 'i' } },
                    { codigo: { $regex: search, $options: 'i' } },
                    { subdomain: { $regex: search, $options: 'i' } }
                ];
            }

            if (status) query.status = status;
            if (plano) query['plano.tipo'] = plano;
            if (estado) query['endereco.estado'] = { $regex: estado, $options: 'i' };

            const [tenants, total] = await Promise.all([
                TenantModel.find(query)
                    .sort({ created_at: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit),
                TenantModel.countDocuments(query)
            ]);

            const data = tenants.map(tenant => TenantMapper.tenantEntityFromObject(tenant));

            return {
                data,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar tenants');
        }
    }

    async atualizar(id: string, atualizarTenantDto: AtualizarTenantDto, userId: string): Promise<TenantEntity> {
        try {
            const tenant = await TenantModel.findByIdAndUpdate(
                id,
                {
                    ...atualizarTenantDto,
                    updated_by: userId,
                    updated_at: new Date()
                },
                { new: true }
            );

            if (!tenant) {
                throw CustomError.notfound('Tenant não encontrado');
            }

            return TenantMapper.tenantEntityFromObject(tenant);
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            if (error.code === 11000) {
                if (error.keyPattern.cnpj) {
                    throw CustomError.badRequest('CNPJ já está cadastrado para outro tenant');
                }
            }
            throw CustomError.internalServerError('Erro ao atualizar tenant');
        }
    }

    async configurar(id: string, configurarTenantDto: ConfigurarTenantDto, userId: string): Promise<TenantEntity> {
        try {
            const tenant = await TenantModel.findByIdAndUpdate(
                id,
                {
                    configuracoes: configurarTenantDto.configuracoes,
                    updated_by: userId,
                    updated_at: new Date()
                },
                { new: true }
            );

            if (!tenant) {
                throw CustomError.notfound('Tenant não encontrado');
            }

            return TenantMapper.tenantEntityFromObject(tenant);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao configurar tenant');
        }
    }

    async atualizarPlano(id: string, plano: any, userId: string): Promise<TenantEntity> {
        try {
            // Atualizar limites baseados no novo plano
            const novosLimites = this.obterLimitesPorPlano(plano.tipo);

            const tenant = await TenantModel.findByIdAndUpdate(
                id,
                {
                    plano: {
                        ...plano,
                        data_inicio: new Date()
                    },
                    limites: novosLimites,
                    updated_by: userId,
                    updated_at: new Date()
                },
                { new: true }
            );

            if (!tenant) {
                throw CustomError.notfound('Tenant não encontrado');
            }

            return TenantMapper.tenantEntityFromObject(tenant);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao atualizar plano');
        }
    }

    async obterEstatisticas(id: string): Promise<EstatisticasTenant> {
        try {
            const tenant = await TenantModel.findById(id);
            if (!tenant) {
                throw CustomError.notfound('Tenant não encontrado');
            }

            const inicioMes = new Date();
            inicioMes.setDate(1);
            inicioMes.setHours(0, 0, 0, 0);

            const [totalUsuarios, totalPacientes, totalUnidades, totalConsultasMes] = await Promise.all([
                UsuarioModel?.countDocuments({ tenant_id: id }) || 0,
                PacienteModel?.countDocuments({ tenant_id: id }) || 0,
                UnidadeModel?.countDocuments({ tenant_id: id }) || 0,
                ConsultaModel?.countDocuments({
                    tenant_id: id,
                    data_hora_agendada: { $gte: inicioMes }
                }) || 0
            ]);

            // Simular uso por módulo (em um cenário real, seria calculado)
            const usoPorModulo: { [modulo: string]: number } = {};
            if (tenant.configuracoes?.modulos_ativos) {
                for (const modulo of tenant.configuracoes.modulos_ativos) {
                    usoPorModulo[modulo] = Math.floor(Math.random() * 100); // Simulação
                }
            }

            return {
                total_usuarios: totalUsuarios,
                total_pacientes: totalPacientes,
                total_unidades: totalUnidades,
                total_consultas_mes: totalConsultasMes,
                armazenamento_usado_gb: Math.floor(Math.random() * 10), // Simulação
                ultimo_acesso: new Date(),
                uso_por_modulo: usoPorModulo
            };
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao obter estatísticas');
        }
    }

    async verificarLimites(id: string): Promise<{ [limite: string]: { atual: number; maximo: number; excedeu: boolean } }> {
        try {
            const tenant = await TenantModel.findById(id);
            if (!tenant) {
                throw CustomError.notfound('Tenant não encontrado');
            }

            const estatisticas = await this.obterEstatisticas(id);
            const limites = tenant.limites || {};

            const resultado: { [limite: string]: { atual: number; maximo: number; excedeu: boolean } } = {};

            if (limites.usuarios_max) {
                resultado.usuarios = {
                    atual: estatisticas.total_usuarios,
                    maximo: limites.usuarios_max,
                    excedeu: estatisticas.total_usuarios > limites.usuarios_max
                };
            }

            if (limites.pacientes_max) {
                resultado.pacientes = {
                    atual: estatisticas.total_pacientes,
                    maximo: limites.pacientes_max,
                    excedeu: estatisticas.total_pacientes > limites.pacientes_max
                };
            }

            if (limites.unidades_max) {
                resultado.unidades = {
                    atual: estatisticas.total_unidades,
                    maximo: limites.unidades_max,
                    excedeu: estatisticas.total_unidades > limites.unidades_max
                };
            }

            if (limites.consultas_mes_max) {
                resultado.consultas_mes = {
                    atual: estatisticas.total_consultas_mes,
                    maximo: limites.consultas_mes_max,
                    excedeu: estatisticas.total_consultas_mes > limites.consultas_mes_max
                };
            }

            if (limites.armazenamento_gb) {
                resultado.armazenamento = {
                    atual: estatisticas.armazenamento_usado_gb,
                    maximo: limites.armazenamento_gb,
                    excedeu: estatisticas.armazenamento_usado_gb > limites.armazenamento_gb
                };
            }

            return resultado;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao verificar limites');
        }
    }

    async suspender(id: string, motivo: string, userId: string): Promise<boolean> {
        try {
            const result = await TenantModel.updateOne(
                { _id: id },
                {
                    status: 'SUSPENSO',
                    'plano.status': 'SUSPENSO',
                    observacoes_suspensao: motivo,
                    data_suspensao: new Date(),
                    updated_by: userId,
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao suspender tenant');
        }
    }

    async reativar(id: string, userId: string): Promise<boolean> {
        try {
            const result = await TenantModel.updateOne(
                { _id: id },
                {
                    status: 'ATIVO',
                    'plano.status': 'ATIVO',
                    $unset: { 
                        observacoes_suspensao: 1,
                        data_suspensao: 1
                    },
                    updated_by: userId,
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao reativar tenant');
        }
    }

    async deletar(id: string): Promise<boolean> {
        try {
            // Verificar se existem dados relacionados
            const [usuarios, pacientes, unidades] = await Promise.all([
                UsuarioModel?.countDocuments({ tenant_id: id }) || 0,
                PacienteModel?.countDocuments({ tenant_id: id }) || 0,
                UnidadeModel?.countDocuments({ tenant_id: id }) || 0
            ]);

            if (usuarios > 0 || pacientes > 0 || unidades > 0) {
                throw CustomError.badRequest('Não é possível deletar tenant com dados relacionados');
            }

            const result = await TenantModel.deleteOne({ _id: id });
            return result.deletedCount > 0;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao deletar tenant');
        }
    }

    private obterLimitesPorPlano(tipo: string): any {
        const limitesPorPlano = {
            'BASICO': {
                usuarios_max: 10,
                pacientes_max: 1000,
                unidades_max: 2,
                consultas_mes_max: 500,
                armazenamento_gb: 5
            },
            'INTERMEDIARIO': {
                usuarios_max: 25,
                pacientes_max: 5000,
                unidades_max: 5,
                consultas_mes_max: 2000,
                armazenamento_gb: 20
            },
            'AVANCADO': {
                usuarios_max: 100,
                pacientes_max: 20000,
                unidades_max: 20,
                consultas_mes_max: 10000,
                armazenamento_gb: 100
            },
            'PERSONALIZADO': {
                usuarios_max: null,
                pacientes_max: null,
                unidades_max: null,
                consultas_mes_max: null,
                armazenamento_gb: null
            }
        };

        return limitesPorPlano[tipo] || limitesPorPlano['BASICO'];
    }

    private obterValorPlano(tipo: string): number {
        const valoresPorPlano = {
            'BASICO': 199.90,
            'INTERMEDIARIO': 499.90,
            'AVANCADO': 999.90,
            'PERSONALIZADO': 0 // Valor personalizado
        };

        return valoresPorPlano[tipo] || valoresPorPlano['BASICO'];
    }
}