import { Validators } from "../../../config";

// domain/dtos/unidade/criar-unidade.dto.ts
export class CriarUnidadeDto {
    private constructor(
        public nome: string,
        public tipo: 'UPA' | 'UBS' | 'HOSPITAL' | 'CLINICA' | 'LABORATORIO' | 'FARMACIA' | 'SECRETARIA',
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

    static create(object: { [key: string]: any }): [string?, CriarUnidadeDto?] {
        const { 
            nome, tipo, cnes, endereco, contato, horario_funcionamento,
            especialidades, capacidade, equipamentos, gestor_responsavel 
        } = object;

        if (!nome) return ['Nome da unidade é obrigatório'];
        if (nome.length < 2) return ['Nome deve ter pelo menos 2 caracteres'];
        if (nome.length > 255) return ['Nome não pode exceder 255 caracteres'];

        if (!tipo) return ['Tipo da unidade é obrigatório'];
        const tiposValidos = ['UPA', 'UBS', 'HOSPITAL', 'CLINICA', 'LABORATORIO', 'FARMACIA', 'SECRETARIA'];
        if (!tiposValidos.includes(tipo)) {
            return ['Tipo de unidade inválido'];
        }

        if (cnes) {
            const cnesLimpo = cnes.replace(/\D/g, '');
            if (cnesLimpo.length !== 7) return ['CNES deve ter 7 dígitos'];
        }

        if (contato?.email && !Validators.email.test(contato.email)) {
            return ['Email de contato inválido'];
        }

        if (contato?.site && !Validators.url.test(contato.site)) {
            return ['Site inválido'];
        }

        if (horario_funcionamento && Array.isArray(horario_funcionamento)) {
            for (const horario of horario_funcionamento) {
                if (horario.dia_semana < 0 || horario.dia_semana > 6) {
                    return ['Dia da semana deve estar entre 0 e 6'];
                }
                if (!horario.funciona_24h) {
                    if (!Validators.hora.test(horario.hora_abertura) || !Validators.hora.test(horario.hora_fechamento)) {
                        return ['Formato de hora inválido (use HH:MM)'];
                    }
                }
            }
        }

        if (equipamentos && Array.isArray(equipamentos)) {
            for (const equip of equipamentos) {
                if (!equip.nome || !equip.quantidade) {
                    return ['Equipamento deve ter nome e quantidade'];
                }
                if (!['FUNCIONANDO', 'MANUTENCAO', 'INATIVO'].includes(equip.status)) {
                    return ['Status do equipamento inválido'];
                }
            }
        }

        if (gestor_responsavel && !Validators.mongoId.test(gestor_responsavel)) {
            return ['ID do gestor responsável inválido'];
        }

        return [undefined, new CriarUnidadeDto(
            nome.trim(),
            tipo,
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