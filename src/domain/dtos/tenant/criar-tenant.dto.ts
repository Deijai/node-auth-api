// domain/dtos/tenant/criar-tenant.dto.ts
import { Validators } from '../../../config/validators';

export class CriarTenantDto {
    private constructor(
        public nome: string,
        public codigo: string,
        public subdomain: string,
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
        public plano?: {
            tipo: 'BASICO' | 'INTERMEDIARIO' | 'AVANCADO' | 'PERSONALIZADO';
            valor_mensal?: number;
        }
    ) {}

    static create(object: { [key: string]: any }): [string?, CriarTenantDto?] {
        const { nome, codigo, subdomain, cnpj, endereco, contato, plano } = object;

        if (!nome) return ['Nome é obrigatório'];
        if (nome.length < 2) return ['Nome deve ter pelo menos 2 caracteres'];
        if (nome.length > 255) return ['Nome não pode exceder 255 caracteres'];

        if (!codigo) return ['Código é obrigatório'];
        if (!/^[a-zA-Z0-9_-]+$/.test(codigo)) {
            return ['Código pode conter apenas letras, números, hífen e underscore'];
        }
        if (codigo.length > 50) return ['Código não pode exceder 50 caracteres'];

        if (!subdomain) return ['Subdomínio é obrigatório'];
        if (!/^[a-z0-9-]+$/.test(subdomain)) {
            return ['Subdomínio pode conter apenas letras minúsculas, números e hífen'];
        }
        if (subdomain.length < 3) return ['Subdomínio deve ter pelo menos 3 caracteres'];
        if (subdomain.length > 63) return ['Subdomínio não pode exceder 63 caracteres'];
        
        // Verificar subdomínios reservados
        const subdomainReservados = ['www', 'api', 'admin', 'app', 'sistema', 'portal'];
        if (subdomainReservados.includes(subdomain)) {
            return ['Subdomínio reservado pelo sistema'];
        }

        if (cnpj) {
            const cnpjLimpo = cnpj.replace(/\D/g, '');
            if (cnpjLimpo.length !== 14) return ['CNPJ deve ter 14 dígitos'];
        }

        if (contato?.email && !Validators.email.test(contato.email)) {
            return ['Email de contato inválido'];
        }

        if (contato?.site && !Validators.url.test(contato.site)) {
            return ['Site inválido'];
        }

        if (plano) {
            const tiposValidos = ['BASICO', 'INTERMEDIARIO', 'AVANCADO', 'PERSONALIZADO'];
            if (!tiposValidos.includes(plano.tipo)) {
                return ['Tipo de plano inválido'];
            }
            if (plano.valor_mensal !== undefined && plano.valor_mensal < 0) {
                return ['Valor mensal não pode ser negativo'];
            }
        }

        return [undefined, new CriarTenantDto(
            nome.trim(),
            codigo.toLowerCase().trim(),
            subdomain.toLowerCase().trim(),
            cnpj?.replace(/\D/g, ''),
            endereco,
            contato,
            plano
        )];
    }
}