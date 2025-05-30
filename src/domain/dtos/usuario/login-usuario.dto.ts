// domain/dtos/usuario/login-usuario.dto.ts
export class LoginUsuarioDto {
    private constructor(
        public usuario: string,
        public senha: string
    ) {}

    static create(object: { [key: string]: any }): [string?, LoginUsuarioDto?] {
        const { usuario, senha } = object;

        if (!usuario) return ['Nome de usuário é obrigatório'];
        if (!senha) return ['Senha é obrigatória'];

        return [undefined, new LoginUsuarioDto(
            usuario.toLowerCase().trim(),
            senha
        )];
    }
}