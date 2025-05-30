// domain/dtos/pessoa/atualizar-pessoa.dto.ts
import { Validators } from '../../../config/validators';
export class AtualizarPessoaDto {
    private constructor(
        public nome?: string,
        public data_nascimento?: Date,
        public sexo?: 'M' | 'F' | 'O',
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
        },
        public status?: 'ATIVO' | 'INATIVO'
    ) {}

    static create(object: { [key: string]: any }): [string?, AtualizarPessoaDto?] {
        const { 
            nome, data_nascimento, sexo, telefone, 
            email, endereco, status 
        } = object;

        if (nome !== undefined) {
            if (nome.length < 2) return ['Nome deve ter pelo menos 2 caracteres'];
            if (nome.length > 255) return ['Nome não pode exceder 255 caracteres'];
        }

        if (data_nascimento !== undefined) {
            const dataNasc = new Date(data_nascimento);
            if (isNaN(dataNasc.getTime())) return ['Data de nascimento inválida'];
            if (dataNasc > new Date()) return ['Data de nascimento não pode ser futura'];
        }

        if (sexo !== undefined && !['M', 'F', 'O'].includes(sexo)) {
            return ['Sexo deve ser M, F ou O'];
        }

        if (telefone !== undefined && telefone.length > 20) {
            return ['Telefone não pode exceder 20 caracteres'];
        }

        if (email !== undefined) {
            if (!Validators.email.test(email)) return ['Email inválido'];
            if (email.length > 255) return ['Email não pode exceder 255 caracteres'];
        }

        if (status !== undefined && !['ATIVO', 'INATIVO'].includes(status)) {
            return ['Status deve ser ATIVO ou INATIVO'];
        }

        return [undefined, new AtualizarPessoaDto(
            nome?.trim(),
            data_nascimento ? new Date(data_nascimento) : undefined,
            sexo,
            telefone?.trim(),
            email?.toLowerCase().trim(),
            endereco,
            status
        )];
    }
}