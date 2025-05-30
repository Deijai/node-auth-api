// domain/dtos/pessoa/criar-pessoa.dto.ts
import { Validators } from '../../../config/validators';

export class CriarPessoaDto {
    private constructor(
        public nome: string,
        public data_nascimento: Date,
        public sexo: 'M' | 'F' | 'O',
        public cpf: string,
        public telefone?: string,
        public email?: string,
        public endereco?: {
            logradouro?: string;
            numero?: string;
            complemento?: string;
            bairro?: string;
            cidade?: string;
            estado?: string;
            cep?: string;
            coordenadas?: {
                latitude?: number;
                longitude?: number;
            };
        }
    ) {}

    static create(object: { [key: string]: any }): [string?, CriarPessoaDto?] {
        const { 
            nome, data_nascimento, sexo, cpf, telefone, 
            email, endereco 
        } = object;

        if (!nome) return ['Nome é obrigatório'];
        if (nome.length < 2) return ['Nome deve ter pelo menos 2 caracteres'];
        if (nome.length > 255) return ['Nome não pode exceder 255 caracteres'];

        if (!data_nascimento) return ['Data de nascimento é obrigatória'];
        const dataNasc = new Date(data_nascimento);
        if (isNaN(dataNasc.getTime())) return ['Data de nascimento inválida'];
        if (dataNasc > new Date()) return ['Data de nascimento não pode ser futura'];

        if (!sexo) return ['Sexo é obrigatório'];
        if (!['M', 'F', 'O'].includes(sexo)) return ['Sexo deve ser M, F ou O'];

        if (!cpf) return ['CPF é obrigatório'];
        const cpfLimpo = cpf.replace(/\D/g, '');
        if (!Validators.cpf.test(cpfLimpo)) return ['CPF inválido'];

        if (telefone && telefone.length > 20) return ['Telefone não pode exceder 20 caracteres'];

        if (email) {
            if (!Validators.email.test(email)) return ['Email inválido'];
            if (email.length > 255) return ['Email não pode exceder 255 caracteres'];
        }

        return [undefined, new CriarPessoaDto(
            nome.trim(),
            dataNasc,
            sexo,
            cpfLimpo,
            telefone?.trim(),
            email?.toLowerCase().trim(),
            endereco
        )];
    }
}