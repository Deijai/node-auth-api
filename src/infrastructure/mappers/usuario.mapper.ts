// infrastructure/mappers/usuario.mapper.ts
import { CustomError } from "../../domain";
import { UsuarioEntity } from "../../domain/entities/usuario.entity";

export class UsuarioMapper {
    static usuarioEntityFromObject(object: { [key: string]: any }): UsuarioEntity {
        const { 
            id, _id, tenant_id, pessoa_id, usuario, senha, papel, ativo,
            unidades_acesso, permissoes, ultimo_acesso, tentativas_login,
            bloqueado_ate, created_at, updated_at, created_by, updated_by, pessoa
        } = object;

        if (!_id && !id) throw CustomError.badRequest('ID obrigatório');
        if (!tenant_id) throw CustomError.badRequest('Tenant ID obrigatório');
        if (!usuario) throw CustomError.badRequest('Nome de usuário obrigatório');
        if (!senha) throw CustomError.badRequest('Senha obrigatória');
        if (!papel) throw CustomError.badRequest('Papel obrigatório');

        return new UsuarioEntity(
            _id || id,
            tenant_id,
            pessoa_id,
            usuario,
            senha,
            papel,
            ativo !== false, // Default true
            unidades_acesso,
            permissoes,
            ultimo_acesso,
            tentativas_login || 0,
            bloqueado_ate,
            created_at,
            updated_at,
            created_by,
            updated_by,
            pessoa
        );
    }

    // Mapper para login (sem senha)
    static usuarioEntityFromObjectSemSenha(object: { [key: string]: any }): UsuarioEntity {
        const usuarioEntity = this.usuarioEntityFromObject(object);
        usuarioEntity.senha = '[PROTECTED]'; // Ocultar senha
        return usuarioEntity;
    }
}