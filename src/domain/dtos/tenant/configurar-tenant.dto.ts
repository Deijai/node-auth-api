import { Validators } from "../../../config";

// domain/dtos/tenant/configurar-tenant.dto.ts
export class ConfigurarTenantDto {
    private constructor(
        public configuracoes: {
            timezone?: string;
            logo_url?: string;
            favicon_url?: string;
            cores_tema?: {
                primaria?: string;
                secundaria?: string;
                acento?: string;
                fundo?: string;
                texto?: string;
            };
            modulos_ativos?: Array<'UPA' | 'UBS' | 'SECRETARIA' | 'LABORATORIO' | 'FARMACIA' | 'HOSPITAL'>;
            configuracoes_sistema?: {
                permite_agendamento_online?: boolean;
                antecedencia_maxima_agendamento?: number;
                antecedencia_minima_agendamento?: number;
                duracao_padrao_consulta?: number;
                permite_reagendamento?: boolean;
                limite_reagendamentos?: number;
                tempo_limite_cancelamento?: number;
                notificacoes_ativas?: boolean;
                lembrete_antecedencia?: number;
            };
            configuracoes_clinicas?: {
                usa_triagem_manchester?: boolean;
                obrigatorio_sinais_vitais?: boolean;
                obrigatorio_diagnostico_cid?: boolean;
                permite_prescricao_digital?: boolean;
                validade_receita_dias?: number;
                requer_assinatura_digital?: boolean;
            };
            integracao?: {
                sus_integrado?: boolean;
                laboratorio_externo?: boolean;
                farmacia_popular?: boolean;
                telemedicina?: boolean;
                prontuario_eletronico?: boolean;
            };
        }
    ) {}

    static create(object: { [key: string]: any }): [string?, ConfigurarTenantDto?] {
        const { configuracoes } = object;

        if (!configuracoes) return ['Configurações são obrigatórias'];

        // Validar timezone
        if (configuracoes.timezone) {
            const timezonesValidas = [
                'America/Sao_Paulo', 'America/Manaus', 'America/Fortaleza',
                'America/Recife', 'America/Bahia', 'America/Campo_Grande'
            ];
            if (!timezonesValidas.includes(configuracoes.timezone)) {
                return ['Timezone inválido'];
            }
        }

        // Validar URLs
        if (configuracoes.logo_url && !Validators.url.test(configuracoes.logo_url)) {
            return ['URL do logo inválida'];
        }
        if (configuracoes.favicon_url && !Validators.url.test(configuracoes.favicon_url)) {
            return ['URL do favicon inválida'];
        }

        // Validar cores (formato hexadecimal)
        if (configuracoes.cores_tema) {
            const hexRegex = /^#[0-9A-F]{6}$/i;
            for (const [key, cor] of Object.entries(configuracoes.cores_tema)) {
                if (cor && !hexRegex.test(cor as string)) {
                    return [`Cor ${key} deve estar no formato hexadecimal (#RRGGBB)`];
                }
            }
        }

        // Validar módulos
        if (configuracoes.modulos_ativos) {
            const modulosValidos = ['UPA', 'UBS', 'SECRETARIA', 'LABORATORIO', 'FARMACIA', 'HOSPITAL'];
            for (const modulo of configuracoes.modulos_ativos) {
                if (!modulosValidos.includes(modulo)) {
                    return [`Módulo ${modulo} inválido`];
                }
            }
        }

        // Validar configurações numéricas
        if (configuracoes.configuracoes_sistema) {
            const config = configuracoes.configuracoes_sistema;
            
            if (config.antecedencia_maxima_agendamento !== undefined && config.antecedencia_maxima_agendamento < 1) {
                return ['Antecedência máxima deve ser pelo menos 1 dia'];
            }
            if (config.antecedencia_minima_agendamento !== undefined && config.antecedencia_minima_agendamento < 0) {
                return ['Antecedência mínima não pode ser negativa'];
            }
            if (config.duracao_padrao_consulta !== undefined && (config.duracao_padrao_consulta < 5 || config.duracao_padrao_consulta > 480)) {
                return ['Duração padrão deve estar entre 5 e 480 minutos'];
            }
            if (config.limite_reagendamentos !== undefined && config.limite_reagendamentos < 0) {
                return ['Limite de reagendamentos não pode ser negativo'];
            }
            if (config.lembrete_antecedencia !== undefined && config.lembrete_antecedencia < 1) {
                return ['Antecedência do lembrete deve ser pelo menos 1 hora'];
            }
        }

        if (configuracoes.configuracoes_clinicas) {
            const config = configuracoes.configuracoes_clinicas;
            
            if (config.validade_receita_dias !== undefined && (config.validade_receita_dias < 1 || config.validade_receita_dias > 365)) {
                return ['Validade da receita deve estar entre 1 e 365 dias'];
            }
        }

        return [undefined, new ConfigurarTenantDto(configuracoes)];
    }
}