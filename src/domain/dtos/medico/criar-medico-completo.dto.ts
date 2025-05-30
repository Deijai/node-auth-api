// domain/dtos/medico/criar-medico-completo.dto.ts
import { CriarPessoaDto } from '../pessoa/criar-pessoa.dto';

export class CriarMedicoCompletoDto {
    private constructor(
        public dadosPessoa: CriarPessoaDto,
        public dadosMedico: {
            crm: string;
            especialidade: string;
            conselho_estado: string;
            data_formacao?: Date;
            instituicao_formacao?: string;
            residencias?: Array<{
                especialidade: string;
                instituicao: string;
                ano_inicio: number;
                ano_fim: number;
            }>;
            unidades_vinculadas?: string[];
            horarios_atendimento?: Array<{
                dia_semana: number;
                hora_inicio: string;
                hora_fim: string;
                unidade_id: string;
            }>;
            valor_consulta?: number;
            aceita_convenio?: boolean;
            convenios?: string[];
        }
    ) {}

    static create(object: { [key: string]: any }): [string?, CriarMedicoCompletoDto?] {
        const { dadosPessoa, dadosMedico } = object;

        if (!dadosPessoa) return ['Dados da pessoa são obrigatórios'];
        if (!dadosMedico) return ['Dados do médico são obrigatórios'];

        const [errorPessoa, pessoaDto] = CriarPessoaDto.create(dadosPessoa);
        if (errorPessoa) return [errorPessoa];

        // Validar dados específicos do médico
        const { crm, especialidade, conselho_estado } = dadosMedico;

        if (!crm) return ['CRM é obrigatório'];
        if (!especialidade) return ['Especialidade é obrigatória'];
        if (!conselho_estado) return ['Estado do conselho é obrigatório'];

        return [undefined, new CriarMedicoCompletoDto(pessoaDto!, dadosMedico)];
    }
}