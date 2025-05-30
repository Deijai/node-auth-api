// domain/use-cases/especialidade/buscar-especialidade.use-case.ts
import { EspecialidadeRepository } from '../../repositories/especialidade.repository';
import { BuscarEspecialidadeDto } from '../../dtos/especialidade/buscar-especialidade.dto';
import { BuscarEspecialidadeResult } from '../../datasources/especialidade.datasource';

interface BuscarEspecialidadeUseCase {
    execute(buscarEspecialidadeDto: BuscarEspecialidadeDto, tenantId: string): Promise<BuscarEspecialidadeResult>;
}

export class BuscarEspecialidade implements BuscarEspecialidadeUseCase {
    constructor(private readonly especialidadeRepository: EspecialidadeRepository) {}

    async execute(buscarEspecialidadeDto: BuscarEspecialidadeDto, tenantId: string): Promise<BuscarEspecialidadeResult> {
        return await this.especialidadeRepository.buscar(buscarEspecialidadeDto, tenantId);
    }
}
