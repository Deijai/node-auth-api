// domain/dtos/usuario/criar-usuario.dto.ts
import { Validators } from '../../../config/validators';

export class CriarUsuarioDto {
    private constructor(
        public pessoa_id: string | undefined,
        public usuario: string,
        public senha: string,
        public papel: 'ADMIN' | 'MEDICO' | 'ENFERMEIRO' | 'RECEPCIONISTA' | 'FARMACEUTICO' | 'LABORATORISTA' | 'GESTOR',
        public unidades_acesso?: string[],
        public permissoes?: string[]
    ) {}

    static create(object: { [key: string]: any }): [string?, CriarUsuarioDto?] {
        const { 
            pessoa_id, usuario, senha, papel, unidades_acesso, permissoes 
        } = object;

        if (pessoa_id && !Validators.mongoId.test(pessoa_id)) {
            return ['ID da pessoa inválido'];
        }

        if (!usuario) return ['Nome de usuário é obrigatório'];
        if (usuario.length < 3) return ['Nome de usuário deve ter pelo menos 3 caracteres'];
        if (usuario.length > 100) return ['Nome de usuário não pode exceder 100 caracteres'];
        if (!/^[a-zA-Z0-9._-]+$/.test(usuario)) {
            return ['Nome de usuário pode conter apenas letras, números, pontos, hífen e underscore'];
        }

        if (!senha) return ['Senha é obrigatória'];
        if (senha.length < 6) return ['Senha deve ter pelo menos 6 caracteres'];
        if (senha.length > 255) return ['Senha não pode exceder 255 caracteres'];

        if (!papel) return ['Papel é obrigatório'];
        const papeisValidos = ['ADMIN', 'MEDICO', 'ENFERMEIRO', 'RECEPCIONISTA', 'FARMACEUTICO', 'LABORATORISTA', 'GESTOR'];
        if (!papeisValidos.includes(papel)) {
            return ['Papel inválido'];
        }

        if (unidades_acesso && Array.isArray(unidades_acesso)) {
            for (const unidadeId of unidades_acesso) {
                if (!Validators.mongoId.test(unidadeId)) {
                    return ['ID de unidade inválido'];
                }
            }
        }

        const permissoesValidas = [
            'CADASTRAR_PACIENTE', 'EDITAR_PACIENTE', 'VISUALIZAR_PACIENTE', 'DELETAR_PACIENTE',
            'CADASTRAR_MEDICO', 'EDITAR_MEDICO', 'VISUALIZAR_MEDICO', 'DELETAR_MEDICO',
            'AGENDAR_CONSULTA', 'CANCELAR_CONSULTA', 'REALIZAR_ATENDIMENTO', 'VISUALIZAR_AGENDA',
            'PRESCREVER_MEDICAMENTO', 'SOLICITAR_EXAME', 'GERAR_RELATORIOS',
            'GERENCIAR_USUARIOS', 'CONFIGURAR_SISTEMA', 'GERENCIAR_UNIDADES',
            'VISUALIZAR_FINANCEIRO', 'GERENCIAR_ESTOQUE'
        ];

        if (permissoes && Array.isArray(permissoes)) {
            for (const permissao of permissoes) {
                if (!permissoesValidas.includes(permissao)) {
                    return [`Permissão inválida: ${permissao}`];
                }
            }
        }

        return [undefined, new CriarUsuarioDto(
            pessoa_id,
            usuario.toLowerCase().trim(),
            senha,
            papel,
            unidades_acesso,
            permissoes
        )];
    }
}