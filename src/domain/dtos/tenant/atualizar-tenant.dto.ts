import { Validators } from "../../../config";

// domain/dtos/tenant/atualizar-tenant.dto.ts
export class AtualizarTenantDto {
    private constructor(
        public nome?: string,
        public cnpj?: string,
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
        public contato?: {
            telefone?: string;
            email?: string;
            site?: string;
            responsavel?: string;
            cargo_responsavel?: string;
        },
        public status?: 'ATIVO' | 'INATIVO' | 'SUSPENSO' | 'PENDENTE'
    ) {}

    static create(object: { [key: string]: any }): [string?, AtualizarTenantDto?] {
        const { nome, cnpj, endereco, contato, status } = object;

        if (nome !== undefined) {
            if (nome.length < 2) return ['Nome deve ter pelo menos 2 caracteres'];
            if (nome.length > 255) return ['Nome não pode exceder 255 caracteres'];
        }

        if (cnpj !== undefined) {
            const cnpjLimpo = cnpj.replace(/\D/g, '');
            if (cnpjLimpo.length !== 14) return ['CNPJ deve ter 14 dígitos'];
        }

        if (contato?.email && !Validators.email.test(contato.email)) {
            return ['Email de contato inválido'];
        }

        if (contato?.site && !Validators.url.test(contato.site)) {
            return ['Site inválido'];
        }

        if (status !== undefined) {
            const statusValidos = ['ATIVO', 'INATIVO', 'SUSPENSO', 'PENDENTE'];
            if (!statusValidos.includes(status)) {
                return ['Status inválido'];
            }
        }

        return [undefined, new AtualizarTenantDto(
            nome?.trim(),
            cnpj?.replace(/\D/g, ''),
            endereco,
            contato,
            status
        )];
    }
}