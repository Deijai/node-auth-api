// infrastructure/datasources/usuario.datasource.impl.ts
import { UsuarioModel, PessoaModel } from "../../data/mongodb";
import { BuscarUsuarioResult, UsuarioDatasource } from "../../domain/datasources/usuario.datasource";
import { UsuarioMapper } from "../mappers/usuario.mapper";
import { BcryptAdapter } from "../../config";
import { CustomError } from "../../domain";
import { AlterarSenhaDto } from "../../domain/dtos/usuario/alterar-senha.dto";
import { AtualizarUsuarioDto } from "../../domain/dtos/usuario/atualizar-usuario.dto";
import { BuscarUsuarioDto } from "../../domain/dtos/usuario/buscar-usuario.dto";
import { CriarUsuarioDto } from "../../domain/dtos/usuario/criar-usuario.dto";
import { LoginUsuarioDto } from "../../domain/dtos/usuario/login-usuario.dto";
import { UsuarioEntity } from "../../domain/entities/usuario.entity";

export class UsuarioDatasourceImpl implements UsuarioDatasource {
    constructor(
        private readonly hashPassword: (password: string) => string = BcryptAdapter.hash,
        private readonly comparePassword: (password: string, hash: string) => boolean = BcryptAdapter.compare
    ) { }

    async criar(criarUsuarioDto: CriarUsuarioDto, tenantId: string, userId: string): Promise<UsuarioEntity> {
        console.log('criarUsuarioDto: ', criarUsuarioDto);

        try {
            // Definir permissões padrão baseadas no papel
            const permissoesPadrao = this.obterPermissoesPorPapel(criarUsuarioDto.papel);
            const permissoesFinais = criarUsuarioDto.permissoes || permissoesPadrao;

            const usuario = await UsuarioModel.create({
                tenant_id: tenantId,
                pessoa_id: criarUsuarioDto.pessoa_id,
                usuario: criarUsuarioDto.usuario,
                senha: this.hashPassword(criarUsuarioDto.senha),
                papel: criarUsuarioDto.papel,
                unidades_acesso: criarUsuarioDto.unidades_acesso,
                permissoes: permissoesFinais,
                created_by: userId,
                updated_by: userId
            });

            const usuarioPopulado = await UsuarioModel.findById(usuario._id).populate('pessoa_id');
            return UsuarioMapper.usuarioEntityFromObjectSemSenha(usuarioPopulado!);
        } catch (error: any) {
            console.log('error ===> ', error);

            if (error.code === 11000) {
                if (error.keyPattern.usuario) {
                    throw CustomError.badRequest('Nome de usuário já existe neste município');
                }
            }
            throw CustomError.internalServerError('Erro ao criar usuário');
        }
    }

    async buscarPorId(id: string, tenantId: string): Promise<UsuarioEntity | null> {
        try {
            const usuario = await UsuarioModel.findOne({ _id: id, tenant_id: tenantId })
                .populate('pessoa_id')
                .populate('unidades_acesso', 'nome tipo');

            if (!usuario) return null;
            return UsuarioMapper.usuarioEntityFromObjectSemSenha(usuario);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar usuário');
        }
    }

    async buscarPorUsuario(usuario: string, tenantId: string): Promise<UsuarioEntity | null> {
        try {
            const usuarioDoc = await UsuarioModel.findOne({ usuario, tenant_id: tenantId })
                .populate('pessoa_id');

            if (!usuarioDoc) return null;
            return UsuarioMapper.usuarioEntityFromObject(usuarioDoc); // Com senha para validação
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar usuário por nome');
        }
    }

    async buscarPorPessoa(pessoaId: string, tenantId: string): Promise<UsuarioEntity | null> {
        try {
            const usuario = await UsuarioModel.findOne({ pessoa_id: pessoaId, tenant_id: tenantId })
                .populate('pessoa_id');

            if (!usuario) return null;
            return UsuarioMapper.usuarioEntityFromObjectSemSenha(usuario);
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar usuário por pessoa');
        }
    }

    async buscar(buscarUsuarioDto: BuscarUsuarioDto, tenantId: string): Promise<BuscarUsuarioResult> {
        try {
            const { page, limit, search, papel, ativo, unidade_id } = buscarUsuarioDto;
            const pipeline: any[] = [
                { $match: { tenant_id: tenantId } },
                {
                    $lookup: {
                        from: 'pessoas',
                        localField: 'pessoa_id',
                        foreignField: '_id',
                        as: 'pessoa'
                    }
                },
                { $unwind: { path: '$pessoa', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        senha: 0 // remove o campo senha
                    }
                }
            ];

            const [usuarios, totalResult] = await Promise.all([
                UsuarioModel.aggregate([
                    ...pipeline,
                    { $sort: { created_at: -1 } },
                    { $skip: (page - 1) * limit },
                    { $limit: limit }
                ]),
                UsuarioModel.aggregate([
                    ...pipeline,
                    { $count: 'total' }
                ])
            ]);

            const total = totalResult[0]?.total || 0;
            const data = usuarios.map(usuario => UsuarioMapper.usuarioEntityFromObjectSemSenha({
                ...usuario,
                senha: '[PROTECTED]'
            }));

            return {
                data,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw CustomError.internalServerError('Erro ao buscar usuários');
        }
    }

    async login(loginUsuarioDto: LoginUsuarioDto, tenantId: string): Promise<UsuarioEntity> {
        try {
            const usuario = await UsuarioModel.findOne({
                usuario: loginUsuarioDto.usuario,
                tenant_id: tenantId
            }).populate('pessoa_id');

            if (!usuario) {
                throw CustomError.unauthorized('Usuário ou senha inválidos');
            }

            if (!this.comparePassword(loginUsuarioDto.senha, usuario.senha)) {
                throw CustomError.unauthorized('Usuário ou senha inválidos');
            }

            return UsuarioMapper.usuarioEntityFromObject(usuario);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro no login');
        }
    }

    async atualizar(id: string, atualizarUsuarioDto: AtualizarUsuarioDto, tenantId: string, userId: string): Promise<UsuarioEntity> {
        try {
            const updateData: any = {
                ...atualizarUsuarioDto,
                updated_by: userId,
                updated_at: new Date()
            };

            // Hash da nova senha se fornecida
            if (atualizarUsuarioDto.senha) {
                updateData.senha = this.hashPassword(atualizarUsuarioDto.senha);
            }

            console.log('updateData: ', updateData);
            

            const usuario = await UsuarioModel.findOneAndUpdate(
                { _id: id, tenant_id: tenantId },
                updateData,
                { new: true }
            ).populate('pessoa_id').populate('unidades_acesso', 'nome tipo');

            if (!usuario) {
                throw CustomError.notfound('Usuário não encontrado');
            }

            return UsuarioMapper.usuarioEntityFromObjectSemSenha(usuario);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao atualizar usuário');
        }
    }

    async alterarSenha(id: string, alterarSenhaDto: AlterarSenhaDto, tenantId: string): Promise<boolean> {
        try {
            // Buscar usuário com senha
            const usuario = await UsuarioModel.findOne({ _id: id, tenant_id: tenantId });
            if (!usuario) {
                throw CustomError.notfound('Usuário não encontrado');
            }

            // Verificar senha atual
            if (!this.comparePassword(alterarSenhaDto.senha_atual, usuario.senha)) {
                throw CustomError.badRequest('Senha atual incorreta');
            }

            // Atualizar senha
            const result = await UsuarioModel.updateOne(
                { _id: id, tenant_id: tenantId },
                {
                    senha: this.hashPassword(alterarSenhaDto.nova_senha),
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServerError('Erro ao alterar senha');
        }
    }

    async bloquearUsuario(id: string, tenantId: string, tempoMinutos: number = 30): Promise<boolean> {
        try {
            const bloqueadoAte = new Date();
            bloqueadoAte.setMinutes(bloqueadoAte.getMinutes() + tempoMinutos);

            const result = await UsuarioModel.updateOne(
                { _id: id, tenant_id: tenantId },
                {
                    bloqueado_ate: bloqueadoAte,
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao bloquear usuário');
        }
    }

    async desbloquearUsuario(id: string, tenantId: string): Promise<boolean> {
        try {
            const result = await UsuarioModel.updateOne(
                { _id: id, tenant_id: tenantId },
                {
                    $unset: { bloqueado_ate: 1 },
                    tentativas_login: 0,
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao desbloquear usuário');
        }
    }

    async registrarAcesso(id: string, tenantId: string): Promise<boolean> {
        try {
            const result = await UsuarioModel.updateOne(
                { _id: id, tenant_id: tenantId },
                {
                    ultimo_acesso: new Date(),
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao registrar acesso');
        }
    }

    async incrementarTentativasLogin(id: string, tenantId: string): Promise<number> {
        try {
            const usuario = await UsuarioModel.findOneAndUpdate(
                { _id: id, tenant_id: tenantId },
                {
                    $inc: { tentativas_login: 1 },
                    updated_at: new Date()
                },
                { new: true }
            );

            return usuario?.tentativas_login || 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao incrementar tentativas');
        }
    }

    async resetarTentativasLogin(id: string, tenantId: string): Promise<boolean> {
        try {
            const result = await UsuarioModel.updateOne(
                { _id: id, tenant_id: tenantId },
                {
                    tentativas_login: 0,
                    updated_at: new Date()
                }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao resetar tentativas');
        }
    }

    async deletar(id: string, tenantId: string): Promise<boolean> {
        try {
            const result = await UsuarioModel.deleteOne({ _id: id, tenant_id: tenantId });
            return result.deletedCount > 0;
        } catch (error) {
            throw CustomError.internalServerError('Erro ao deletar usuário');
        }
    }

    private obterPermissoesPorPapel(papel: string): string[] {
        const permissoesPorPapel: { [key: string]: string[] } = {
            'ADMIN': [
                'CADASTRAR_PACIENTE', 'EDITAR_PACIENTE', 'VISUALIZAR_PACIENTE', 'DELETAR_PACIENTE',
                'CADASTRAR_MEDICO', 'EDITAR_MEDICO', 'VISUALIZAR_MEDICO', 'DELETAR_MEDICO',
                'AGENDAR_CONSULTA', 'CANCELAR_CONSULTA', 'REALIZAR_ATENDIMENTO', 'VISUALIZAR_AGENDA',
                'PRESCREVER_MEDICAMENTO', 'SOLICITAR_EXAME', 'GERAR_RELATORIOS',
                'GERENCIAR_USUARIOS', 'CONFIGURAR_SISTEMA', 'GERENCIAR_UNIDADES',
                'VISUALIZAR_FINANCEIRO', 'GERENCIAR_ESTOQUE'
            ],
            'MEDICO': [
                'VISUALIZAR_PACIENTE', 'EDITAR_PACIENTE',
                'AGENDAR_CONSULTA', 'CANCELAR_CONSULTA', 'REALIZAR_ATENDIMENTO', 'VISUALIZAR_AGENDA',
                'PRESCREVER_MEDICAMENTO', 'SOLICITAR_EXAME'
            ],
            'ENFERMEIRO': [
                'VISUALIZAR_PACIENTE', 'EDITAR_PACIENTE',
                'AGENDAR_CONSULTA', 'VISUALIZAR_AGENDA'
            ],
            'RECEPCIONISTA': [
                'CADASTRAR_PACIENTE', 'EDITAR_PACIENTE', 'VISUALIZAR_PACIENTE',
                'AGENDAR_CONSULTA', 'CANCELAR_CONSULTA', 'VISUALIZAR_AGENDA'
            ],
            'FARMACEUTICO': [
                'VISUALIZAR_PACIENTE', 'GERENCIAR_ESTOQUE'
            ],
            'LABORATORISTA': [
                'VISUALIZAR_PACIENTE', 'GERENCIAR_ESTOQUE'
            ],
            'GESTOR': [
                'VISUALIZAR_PACIENTE', 'VISUALIZAR_MEDICO', 'VISUALIZAR_AGENDA',
                'GERAR_RELATORIOS', 'VISUALIZAR_FINANCEIRO'
            ]
        };

        return permissoesPorPapel[papel] || [];
    }
}