// domain/entities/usuario.entity.ts
export class UsuarioEntity {
    constructor(
        public id: string,
        public tenant_id: string,
        public pessoa_id: string, // Opcional para usuários de sistema
        public usuario: string,
        public senha: string,
        public papel: 'ADMIN' | 'MEDICO' | 'ENFERMEIRO' | 'RECEPCIONISTA' | 'FARMACEUTICO' | 'LABORATORISTA' | 'GESTOR',
        public ativo: boolean = true,
        public unidades_acesso?: string[],
        public permissoes?: Array<
            'CADASTRAR_PACIENTE' | 'EDITAR_PACIENTE' | 'VISUALIZAR_PACIENTE' | 'DELETAR_PACIENTE' |
            'CADASTRAR_MEDICO' | 'EDITAR_MEDICO' | 'VISUALIZAR_MEDICO' | 'DELETAR_MEDICO' |
            'AGENDAR_CONSULTA' | 'CANCELAR_CONSULTA' | 'REALIZAR_ATENDIMENTO' | 'VISUALIZAR_AGENDA' |
            'PRESCREVER_MEDICAMENTO' | 'SOLICITAR_EXAME' | 'GERAR_RELATORIOS' |
            'GERENCIAR_USUARIOS' | 'CONFIGURAR_SISTEMA' | 'GERENCIAR_UNIDADES' |
            'VISUALIZAR_FINANCEIRO' | 'GERENCIAR_ESTOQUE'
        >,
        public ultimo_acesso?: Date,
        public tentativas_login: number = 0,
        public bloqueado_ate?: Date,
        public created_at?: Date,
        public updated_at?: Date,
        public created_by?: string,
        public updated_by?: string,
        // Dados da pessoa (quando populado)
        public pessoa?: {
            nome: string;
            cpf: string;
            email?: string;
            telefone?: string;
        }
    ) {}

    // Método para verificar se tem permissão
    temPermissao(permissao: string): boolean {
        return this.permissoes?.includes(permissao as any) || false;
    }

    // Método para verificar se está bloqueado
    estaBloqueado(): boolean {
        if (!this.bloqueado_ate) return false;
        return new Date() < this.bloqueado_ate;
    }

    // Método para verificar se tem acesso à unidade
    temAcessoUnidade(unidadeId: string): boolean {
        if (!this.unidades_acesso || this.unidades_acesso.length === 0) return true; // Acesso global
        return this.unidades_acesso.includes(unidadeId);
    }
}