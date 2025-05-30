// domain/dtos/usuario/alterar-senha.dto.ts
export class AlterarSenhaDto {
    private constructor(
        public senha_atual: string,
        public nova_senha: string,
        public confirmar_senha: string
    ) {}

    static create(object: { [key: string]: any }): [string?, AlterarSenhaDto?] {
        const { senha_atual, nova_senha, confirmar_senha } = object;

        if (!senha_atual) return ['Senha atual é obrigatória'];
        if (!nova_senha) return ['Nova senha é obrigatória'];
        if (!confirmar_senha) return ['Confirmação de senha é obrigatória'];

        if (nova_senha.length < 6) return ['Nova senha deve ter pelo menos 6 caracteres'];
        if (nova_senha.length > 255) return ['Nova senha não pode exceder 255 caracteres'];

        if (nova_senha !== confirmar_senha) {
            return ['Nova senha e confirmação não coincidem'];
        }

        if (senha_atual === nova_senha) {
            return ['A nova senha deve ser diferente da senha atual'];
        }

        return [undefined, new AlterarSenhaDto(
            senha_atual,
            nova_senha,
            confirmar_senha
        )];
    }
}