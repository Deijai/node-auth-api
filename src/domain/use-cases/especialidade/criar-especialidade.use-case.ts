
// domain/use-cases/especialidade/criar-especialidade.use-case.ts
import { EspecialidadeRepository } from '../../repositories/especialidade.repository';
import { CriarEspecialidadeDto } from '../../dtos/especialidade/criar-especialidade.dto';
import { EspecialidadeEntity } from '../../entities/especialidade.entity';
import { CustomError } from '../../errors/custom.error';

interface CriarEspecialidadeUseCase {
    execute(criarEspecialidadeDto: CriarEspecialidadeDto, tenantId: string, userId: string): Promise<EspecialidadeEntity>;
}

export class CriarEspecialidade implements CriarEspecialidadeUseCase {
    constructor(private readonly especialidadeRepository: EspecialidadeRepository) {}

    async execute(criarEspecialidadeDto: CriarEspecialidadeDto, tenantId: string, userId: string): Promise<EspecialidadeEntity> {
        // Verificar se código já existe
        const especialidadeExistente = await this.especialidadeRepository.buscarPorCodigo(criarEspecialidadeDto.codigo, tenantId);
        if (especialidadeExistente) {
            throw CustomError.badRequest('Código da especialidade já existe neste município');
        }

        return await this.especialidadeRepository.criar(criarEspecialidadeDto, tenantId, userId);
    }
}