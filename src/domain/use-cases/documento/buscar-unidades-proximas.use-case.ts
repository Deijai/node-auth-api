// domain/use-cases/unidade/buscar-unidades-proximas.use-case.ts
import { UnidadeRepository } from '../../repositories/unidade.repository';
import { UnidadeEntity } from '../../entities/unidade.entity';

interface BuscarUnidadesProximasUseCase {
    execute(latitude: number, longitude: number, raioKm: number, tenantId: string): Promise<UnidadeEntity[]>;
}

export class BuscarUnidadesProximas implements BuscarUnidadesProximasUseCase {
    constructor(private readonly unidadeRepository: UnidadeRepository) {}

    async execute(latitude: number, longitude: number, raioKm: number, tenantId: string): Promise<UnidadeEntity[]> {
        return await this.unidadeRepository.buscarProximas(latitude, longitude, raioKm, tenantId);
    }
}