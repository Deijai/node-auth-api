// domain/use-cases/paciente/buscar-paciente.use-case.ts
import { PacienteRepository } from '../../repositories/paciente.repository';
import { BuscarPacienteDto } from '../../dtos/paciente/buscar-paciente.dto';
import { BuscarPacienteResult } from '../../datasources/paciente.datasource';

interface BuscarPacienteUseCase {
    execute(buscarPacienteDto: BuscarPacienteDto, tenantId: string): Promise<BuscarPacienteResult>;
}

export class BuscarPaciente implements BuscarPacienteUseCase {
    constructor(private readonly pacienteRepository: PacienteRepository) {}

    async execute(buscarPacienteDto: BuscarPacienteDto, tenantId: string): Promise<BuscarPacienteResult> {
        return await this.pacienteRepository.buscar(buscarPacienteDto, tenantId);
    }
}