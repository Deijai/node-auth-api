// domain/use-cases/especialidade/atualizar-especialidade.use-case.ts
import { EspecialidadeRepository } from '../../repositories/especialidade.repository';
import { AtualizarEspecialidadeDto } from '../../dtos/especialidade/atualizar-especialidade.dto';
import { EspecialidadeEntity } from '../../entities/especialidade.entity';
import { CustomError } from '../../errors/custom.error';

interface AtualizarEspecialidadeUseCase {
    execute(id: string, atualizarEspecialidadeDto: AtualizarEspecialidadeDto, tenantId: string, userId: string): Promise<EspecialidadeEntity>;
}

export class AtualizarEspecialidade implements AtualizarEspecialidadeUseCase {
    constructor(private readonly especialidadeRepository: EspecialidadeRepository) {}

    async execute(id: string, atualizarEspecialidadeDto: AtualizarEspecialidadeDto, tenantId: string, userId: string): Promise<EspecialidadeEntity> {
        // Verificar se especialidade existe
        const especialidadeExistente = await this.especialidadeRepository.buscarPorId(id, tenantId);
        if (!especialidadeExistente) {
            throw CustomError.notfound('Especialidade não encontrada');
        }

        return await this.especialidadeRepository.atualizar(id, atualizarEspecialidadeDto, tenantId, userId);
    }
}