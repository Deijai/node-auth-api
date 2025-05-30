import { Validators } from "../../../config";

// domain/dtos/usuario/atualizar-usuario.dto.ts
export class AtualizarUsuarioDto {
    private constructor(
        public senha?: string,
        public papel?: 'ADMIN' | 'MEDICO' | 'ENFERMEIRO' | 'RECEPCIONISTA' | 'FARMACEUTICO' | 'LABORATORISTA' | 'GESTOR',
        public ativo?: boolean,
        public unidades_acesso?: string[],
        public permissoes?: string[]
    ) {}

    static create(object: { [key: string]: any }): [string?, AtualizarUsuarioDto?] {
        const { senha, papel, ativo, unidades_acesso, permissoes } = object;

        if (senha !== undefined) {
            if (senha.length < 6) return ['Senha deve ter pelo menos 6 caracteres'];
            if (senha.length > 255) return ['Senha não pode exceder 255 caracteres'];
        }

        if (papel !== undefined) {
            const papeisValidos = ['ADMIN', 'MEDICO', 'ENFERMEIRO', 'RECEPCIONISTA', 'FARMACEUTICO', 'LABORATORISTA', 'GESTOR'];
            if (!papeisValidos.includes(papel)) {
                return ['Papel inválido'];
            }
        }

        if (unidades_acesso !== undefined && Array.isArray(unidades_acesso)) {
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

        if (permissoes !== undefined && Array.isArray(permissoes)) {
            for (const permissao of permissoes) {
                if (!permissoesValidas.includes(permissao)) {
                    return [`Permissão inválida: ${permissao}`];
                }
            }
        }

        return [undefined, new AtualizarUsuarioDto(
            senha,
            papel,
            ativo,
            unidades_acesso,
            permissoes
        )];
    }
}