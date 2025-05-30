// domain/dtos/paciente/atualizar-paciente.dto.ts
export class AtualizarPacienteDto {
    private constructor(
        public numero_cartao_sus?: string,
        public tipo_sanguineo?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
        public alergias?: string,
        public historico_medico?: string,
        public medicamentos_uso_continuo?: Array<{
            nome: string;
            dosagem: string;
            frequencia: string;
        }>,
        public contato_emergencia?: {
            nome: string;
            parentesco: string;
            telefone: string;
        },
        public observacoes?: string
    ) {}

    static create(object: { [key: string]: any }): [string?, AtualizarPacienteDto?] {
        const { 
            numero_cartao_sus, tipo_sanguineo, alergias, 
            historico_medico, medicamentos_uso_continuo, contato_emergencia,
            observacoes 
        } = object;

        if (numero_cartao_sus !== undefined) {
            const cartaoLimpo = numero_cartao_sus.replace(/\D/g, '');
            if (cartaoLimpo.length !== 15) return ['Cartão SUS deve ter 15 dígitos'];
        }

        if (tipo_sanguineo !== undefined && !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(tipo_sanguineo)) {
            return ['Tipo sanguíneo inválido'];
        }

        if (alergias !== undefined && alergias.length > 1000) {
            return ['Campo alergias não pode exceder 1000 caracteres'];
        }

        if (historico_medico !== undefined && historico_medico.length > 2000) {
            return ['Histórico médico não pode exceder 2000 caracteres'];
        }

        if (medicamentos_uso_continuo !== undefined) {
            if (!Array.isArray(medicamentos_uso_continuo)) {
                return ['Medicamentos de uso contínuo deve ser um array'];
            }
            
            for (const med of medicamentos_uso_continuo) {
                if (!med.nome || !med.dosagem || !med.frequencia) {
                    return ['Medicamento deve ter nome, dosagem e frequência'];
                }
            }
        }

        if (contato_emergencia !== undefined) {
            const { nome, parentesco, telefone } = contato_emergencia;
            if (!nome || !parentesco || !telefone) {
                return ['Contato de emergência deve ter nome, parentesco e telefone'];
            }
            if (telefone.length > 20) {
                return ['Telefone do contato de emergência muito longo'];
            }
        }

        return [undefined, new AtualizarPacienteDto(
            numero_cartao_sus?.replace(/\D/g, ''),
            tipo_sanguineo,
            alergias?.trim(),
            historico_medico?.trim(),
            medicamentos_uso_continuo,
            contato_emergencia,
            observacoes?.trim()
        )];
    }
}
