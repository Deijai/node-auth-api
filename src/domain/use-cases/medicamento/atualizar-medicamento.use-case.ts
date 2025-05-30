// domain/use-cases/medicamento/atualizar-medicamento.use-case.ts
import { MedicamentoRepository } from '../../repositories/medicamento.repository';
import { AtualizarMedicamentoDto } from '../../dtos/medicamento/atualizar-medicamento.dto';
import { MedicamentoEntity } from '../../entities/medicamento.entity';
import { CustomError } from '../../errors/custom.error';

interface AtualizarMedicamentoUseCase {
    execute(id: string, atualizarMedicamentoDto: AtualizarMedicamentoDto, tenantId: string, userId: string): Promise<MedicamentoEntity>;
}

export class AtualizarMedicamento implements AtualizarMedicamentoUseCase {
    constructor(private readonly medicamentoRepository: MedicamentoRepository) {}

    async execute(id: string, atualizarMedicamentoDto: AtualizarMedicamentoDto, tenantId: string, userId: string): Promise<MedicamentoEntity> {
        // Verificar se medicamento existe
        const medicamentoExistente = await this.medicamentoRepository.buscarPorId(id, tenantId);
        if (!medicamentoExistente) {
            throw CustomError.notfound('Medicamento não encontrado');
        }

        // Verificar se código EAN já existe em outro medicamento (se fornecido)
        if (atualizarMedicamentoDto.codigo_ean) {
            const medicamentoComEan = await this.medicamentoRepository.buscarPorCodigoEan(atualizarMedicamentoDto.codigo_ean, tenantId);
            if (medicamentoComEan && medicamentoComEan.id !== id) {
                throw CustomError.badRequest('Código EAN já está em uso por outro medicamento');
            }
        }

        return await this.medicamentoRepository.atualizar(id, atualizarMedicamentoDto, tenantId, userId);
    }
}