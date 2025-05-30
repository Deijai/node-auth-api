// infrastructure/mappers/pessoa.mapper.ts
import { Validators } from "../../config";
import { CustomError, PessoaEntity } from "../../domain";

export class PessoaMapper {
    static pessoaEntityFromObject(object: { [key: string]: any }): PessoaEntity {
        const { 
            id, _id, tenant_id, nome, data_nascimento, sexo, cpf, 
            telefone, email, endereco, status, created_at, updated_at,
            created_by, updated_by
        } = object;

        if (!_id && !id) throw CustomError.badRequest('ID obrigatório');
        if (!tenant_id) throw CustomError.badRequest('Tenant ID obrigatório');
        if (!nome) throw CustomError.badRequest('Nome obrigatório');
        if (!data_nascimento) throw CustomError.badRequest('Data de nascimento obrigatória');
        if (!sexo) throw CustomError.badRequest('Sexo obrigatório');
        if (!['M', 'F', 'O'].includes(sexo)) throw CustomError.badRequest('Sexo inválido');
        if (!cpf) throw CustomError.badRequest('CPF obrigatório');

        const cpfLimpo = cpf.replace(/\D/g, '');
        if (!Validators.cpf.test(cpfLimpo)) throw CustomError.badRequest('CPF inválido');

        if (email && !Validators.email.test(email)) {
            throw CustomError.badRequest('Email inválido');
        }

        return new PessoaEntity(
            _id || id,
            tenant_id,
            nome,
            new Date(data_nascimento),
            sexo,
            cpfLimpo,
            telefone,
            email,
            endereco,
            status || 'ATIVO',
            created_at,
            updated_at,
            created_by,
            updated_by
        );
    }
}