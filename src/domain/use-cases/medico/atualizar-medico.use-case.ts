// domain/use-cases/medico/atualizar-medico.use-case.ts
import { MedicoRepository } from '../../repositories/medico.repository';
import { AtualizarMedicoDto } from '../../dtos/medico/atualizar-medico.dto';
import { MedicoEntity } from '../../entities/medico.entity';
import { CustomError } from '../../errors/custom.error';

interface AtualizarMedicoUseCase {
    execute(id: string, atualizarMedicoDto: AtualizarMedicoDto, tenantId: string, userId: string): Promise<MedicoEntity>;
}

export class AtualizarMedico implements AtualizarMedicoUseCase {
    constructor(private readonly medicoRepository: MedicoRepository) {}

    async execute(id: string, atualizarMedicoDto: AtualizarMedicoDto, tenantId: string, userId: string): Promise<MedicoEntity> {
        // Verificar se médico existe
        const medicoExistente = await this.medicoRepository.buscarPorId(id, tenantId);
        if (!medicoExistente) {
            throw CustomError.notfound('Médico não encontrado');
        }

        return await this.medicoRepository.atualizar(id, atualizarMedicoDto, tenantId, userId);
    }
}