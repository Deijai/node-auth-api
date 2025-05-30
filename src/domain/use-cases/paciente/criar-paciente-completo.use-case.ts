// domain/use-cases/paciente/criar-paciente-completo.use-case.ts
import { PacienteRepository } from '../../repositories/paciente.repository';
import { CriarPacienteCompletoDto } from '../../dtos/paciente/criar-paciente-completo.dto';
import { PacienteEntity } from '../../entities/paciente.entity';
import { CustomError } from '../../errors/custom.error';
import { PessoaRepository } from '../../repositories/pessoa.repository';

interface CriarPacienteCompletoUseCase {
    execute(criarPacienteCompletoDto: CriarPacienteCompletoDto, tenantId: string, userId: string): Promise<PacienteEntity>;
}

export class CriarPacienteCompleto implements CriarPacienteCompletoUseCase {
    constructor(
        private readonly pacienteRepository: PacienteRepository,
        private readonly pessoaRepository: PessoaRepository
    ) {}

    async execute(criarPacienteCompletoDto: CriarPacienteCompletoDto, tenantId: string, userId: string): Promise<PacienteEntity> {
        // Verificar se CPF já existe
        const pessoaExistente = await this.pessoaRepository.buscarPorCpf(criarPacienteCompletoDto.dadosPessoa.cpf, tenantId);
        if (pessoaExistente) {
            throw CustomError.badRequest('CPF já cadastrado neste município');
        }

        // Verificar se cartão SUS já existe (se fornecido)
        if (criarPacienteCompletoDto.dadosPaciente.numero_cartao_sus) {
            const pacienteComCartao = await this.pacienteRepository.buscarPorCartaoSus(
                criarPacienteCompletoDto.dadosPaciente.numero_cartao_sus, 
                tenantId
            );
            if (pacienteComCartao) {
                throw CustomError.badRequest('Cartão SUS já cadastrado para outro paciente');
            }
        }

        return await this.pacienteRepository.criarCompleto(criarPacienteCompletoDto, tenantId, userId);
    }
}