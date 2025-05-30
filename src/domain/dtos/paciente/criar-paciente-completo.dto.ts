// domain/dtos/paciente/criar-paciente-completo.dto.ts
import { CriarPessoaDto } from '../pessoa/criar-pessoa.dto';

export class CriarPacienteCompletoDto {
    private constructor(
        public dadosPessoa: CriarPessoaDto,
        public dadosPaciente: {
            numero_cartao_sus?: string;
            tipo_sanguineo?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
            alergias?: string;
            historico_medico?: string;
            medicamentos_uso_continuo?: Array<{
                nome: string;
                dosagem: string;
                frequencia: string;
            }>;
            contato_emergencia?: {
                nome: string;
                parentesco: string;
                telefone: string;
            };
            observacoes?: string;
        }
    ) {}

    static create(object: { [key: string]: any }): [string?, CriarPacienteCompletoDto?] {
        const { dadosPessoa, dadosPaciente } = object;

        if (!dadosPessoa) return ['Dados da pessoa são obrigatórios'];
        if (!dadosPaciente) return ['Dados do paciente são obrigatórios'];

        const [errorPessoa, pessoaDto] = CriarPessoaDto.create(dadosPessoa);
        if (errorPessoa) return [errorPessoa];

        // Validar dados específicos do paciente
        const { numero_cartao_sus, tipo_sanguineo } = dadosPaciente;

        if (numero_cartao_sus) {
            const cartaoLimpo = numero_cartao_sus.replace(/\D/g, '');
            if (cartaoLimpo.length !== 15) return ['Cartão SUS deve ter 15 dígitos'];
        }

        if (tipo_sanguineo && !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(tipo_sanguineo)) {
            return ['Tipo sanguíneo inválido'];
        }

        return [undefined, new CriarPacienteCompletoDto(pessoaDto!, dadosPaciente)];
    }
}