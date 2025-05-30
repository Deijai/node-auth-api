// domain/use-cases/medicamento/buscar-medicamento.use-case.ts
import { MedicamentoRepository } from '../../repositories/medicamento.repository';
import { BuscarMedicamentoDto } from '../../dtos/medicamento/buscar-medicamento.dto';
import { BuscarMedicamentoResult } from '../../datasources/medicamento.datasource';

interface BuscarMedicamentoUseCase {
    execute(buscarMedicamentoDto: BuscarMedicamentoDto, tenantId: string): Promise<BuscarMedicamentoResult>;
}

export class BuscarMedicamento implements BuscarMedicamentoUseCase {
    constructor(private readonly medicamentoRepository: MedicamentoRepository) {}

    async execute(buscarMedicamentoDto: BuscarMedicamentoDto, tenantId: string): Promise<BuscarMedicamentoResult> {
        return await this.medicamentoRepository.buscar(buscarMedicamentoDto, tenantId);
    }
}