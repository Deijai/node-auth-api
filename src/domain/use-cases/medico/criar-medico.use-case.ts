// domain/use-cases/medico/criar-medico.use-case.ts
import { MedicoRepository } from '../../repositories/medico.repository';
import { PessoaRepository } from '../../repositories/pessoa.repository';
import { CriarMedicoDto } from '../../dtos/medico/criar-medico.dto';
import { MedicoEntity } from '../../entities/medico.entity';
import { CustomError } from '../../errors/custom.error';

interface CriarMedicoUseCase {
    execute(criarMedicoDto: CriarMedicoDto, tenantId: string, userId: string): Promise<MedicoEntity>;
}

export class CriarMedico implements CriarMedicoUseCase {
    constructor(
        private readonly medicoRepository: MedicoRepository,
        private readonly pessoaRepository: PessoaRepository
    ) {}

    async execute(criarMedicoDto: CriarMedicoDto, tenantId: string, userId: string): Promise<MedicoEntity> {
        // Verificar se pessoa existe
        const pessoa = await this.pessoaRepository.buscarPorId(criarMedicoDto.pessoa_id, tenantId);
        if (!pessoa) {
            throw CustomError.badRequest('Pessoa não encontrada');
        }

        // Verificar se já existe médico para esta pessoa
        const medicoExistente = await this.medicoRepository.buscarPorPessoa(criarMedicoDto.pessoa_id, tenantId);
        if (medicoExistente) {
            throw CustomError.badRequest('Já existe um médico cadastrado para esta pessoa');
        }

        // Verificar se CRM já existe no tenant
        const medicoCrm = await this.medicoRepository.buscarPorCrm(criarMedicoDto.crm, tenantId);
        if (medicoCrm) {
            throw CustomError.badRequest('CRM já cadastrado neste município');
        }

        return await this.medicoRepository.criar(criarMedicoDto, tenantId, userId);
    }
}