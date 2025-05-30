// domain/use-cases/medico/criar-medico-completo.use-case.ts
import { MedicoRepository } from '../../repositories/medico.repository';
import { PessoaRepository } from '../../repositories/pessoa.repository';
import { CriarMedicoCompletoDto } from '../../dtos/medico/criar-medico-completo.dto';
import { MedicoEntity } from '../../entities/medico.entity';
import { CustomError } from '../../errors/custom.error';

interface CriarMedicoCompletoUseCase {
    execute(criarMedicoCompletoDto: CriarMedicoCompletoDto, tenantId: string, userId: string): Promise<MedicoEntity>;
}

export class CriarMedicoCompleto implements CriarMedicoCompletoUseCase {
    constructor(
        private readonly medicoRepository: MedicoRepository,
        private readonly pessoaRepository: PessoaRepository
    ) {}

    async execute(criarMedicoCompletoDto: CriarMedicoCompletoDto, tenantId: string, userId: string): Promise<MedicoEntity> {
        // Verificar se CPF já existe
        const pessoaExistente = await this.pessoaRepository.buscarPorCpf(criarMedicoCompletoDto.dadosPessoa.cpf, tenantId);
        if (pessoaExistente) {
            throw CustomError.badRequest('CPF já cadastrado neste município');
        }

        // Verificar se CRM já existe no tenant
        const medicoCrm = await this.medicoRepository.buscarPorCrm(criarMedicoCompletoDto.dadosMedico.crm, tenantId);
        if (medicoCrm) {
            throw CustomError.badRequest('CRM já cadastrado neste município');
        }

        return await this.medicoRepository.criarCompleto(criarMedicoCompletoDto, tenantId, userId);
    }
}