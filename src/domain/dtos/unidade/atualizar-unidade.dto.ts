import { Validators } from "../../../config";

// domain/dtos/unidade/atualizar-unidade.dto.ts
export class AtualizarUnidadeDto {
    private constructor(
        public nome?: string,
        public cnes?: string,
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
        },
        public horario_funcionamento?: Array<{
            dia_semana: number;
            hora_abertura: string;
            hora_fechamento: string;
            funciona_24h: boolean;
        }>,
        public especialidades?: Array<{
            nome: string;
            ativa: boolean;
        }>,
        public capacidade?: {
            leitos_total?: number;
            leitos_uti?: number;
            consultorios?: number;
            salas_cirurgia?: number;
        },
        public equipamentos?: Array<{
            nome: string;
            modelo?: string;
            quantidade: number;
            status: 'FUNCIONANDO' | 'MANUTENCAO' | 'INATIVO';
        }>,
        public gestor_responsavel?: string
    ) {}

    static create(object: { [key: string]: any }): [string?, AtualizarUnidadeDto?] {
        const { 
            nome, cnes, endereco, contato, horario_funcionamento,
            especialidades, capacidade, equipamentos, gestor_responsavel 
        } = object;

        if (nome !== undefined) {
            if (nome.length < 2) return ['Nome deve ter pelo menos 2 caracteres'];
            if (nome.length > 255) return ['Nome não pode exceder 255 caracteres'];
        }

        if (cnes !== undefined) {
            const cnesLimpo = cnes.replace(/\D/g, '');
            if (cnesLimpo.length !== 7) return ['CNES deve ter 7 dígitos'];
        }

        if (contato?.email && !Validators.email.test(contato.email)) {
            return ['Email de contato inválido'];
        }

        if (contato?.site && !Validators.url.test(contato.site)) {
            return ['Site inválido'];
        }

        if (gestor_responsavel !== undefined && gestor_responsavel && !Validators.mongoId.test(gestor_responsavel)) {
            return ['ID do gestor responsável inválido'];
        }

        return [undefined, new AtualizarUnidadeDto(
            nome?.trim(),
            cnes?.replace(/\D/g, ''),
            endereco,
            contato,
            horario_funcionamento,
            especialidades,
            capacidade,
            equipamentos,
            gestor_responsavel
        )];
    }
}