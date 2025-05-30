// domain/use-cases/medico/buscar-medico.use-case.ts
import { MedicoRepository } from '../../repositories/medico.repository';
import { BuscarMedicoDto } from '../../dtos/medico/buscar-medico.dto';
import { BuscarMedicoResult } from '../../datasources/medico.datasource';

interface BuscarMedicoUseCase {
    execute(buscarMedicoDto: BuscarMedicoDto, tenantId: string): Promise<BuscarMedicoResult>;
}

export class BuscarMedico implements BuscarMedicoUseCase {
    constructor(private readonly medicoRepository: MedicoRepository) {}

    async execute(buscarMedicoDto: BuscarMedicoDto, tenantId: string): Promise<BuscarMedicoResult> {
        return await this.medicoRepository.buscar(buscarMedicoDto, tenantId);
    }
}