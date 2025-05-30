// domain/use-cases/paciente/criar-paciente.use-case.ts
import { PacienteRepository } from '../../repositories/paciente.repository';
import { CriarPacienteDto } from '../../dtos/paciente/criar-paciente.dto';
import { PacienteEntity } from '../../entities/paciente.entity';
import { CustomError } from '../../errors/custom.error';
import { PessoaRepository } from '../../repositories/pessoa.repository';

interface CriarPacienteUseCase {
    execute(criarPacienteDto: CriarPacienteDto, tenantId: string, userId: string): Promise<PacienteEntity>;
}

export class CriarPaciente implements CriarPacienteUseCase {
    constructor(
        private readonly pacienteRepository: PacienteRepository,
        private readonly pessoaRepository: PessoaRepository
    ) {}

    async execute(criarPacienteDto: CriarPacienteDto, tenantId: string, userId: string): Promise<PacienteEntity> {
        // Verificar se pessoa existe
        const pessoa = await this.pessoaRepository.buscarPorId(criarPacienteDto.pessoa_id, tenantId);
        if (!pessoa) {
            throw CustomError.badRequest('Pessoa não encontrada');
        }

        // Verificar se já existe paciente para esta pessoa
        const pacienteExistente = await this.pacienteRepository.buscarPorPessoa(criarPacienteDto.pessoa_id, tenantId);
        if (pacienteExistente) {
            throw CustomError.badRequest('Já existe um paciente cadastrado para esta pessoa');
        }

        // Verificar se cartão SUS já existe (se fornecido)
        if (criarPacienteDto.numero_cartao_sus) {
            const pacienteComCartao = await this.pacienteRepository.buscarPorCartaoSus(criarPacienteDto.numero_cartao_sus, tenantId);
            if (pacienteComCartao) {
                throw CustomError.badRequest('Cartão SUS já cadastrado para outro paciente');
            }
        }

        return await this.pacienteRepository.criar(criarPacienteDto, tenantId, userId);
    }
}