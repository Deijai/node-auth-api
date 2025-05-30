// domain/use-cases/medicamento/criar-medicamento.use-case.ts
import { MedicamentoRepository } from '../../repositories/medicamento.repository';
import { CriarMedicamentoDto } from '../../dtos/medicamento/criar-medicamento.dto';
import { MedicamentoEntity } from '../../entities/medicamento.entity';
import { CustomError } from '../../errors/custom.error';

interface CriarMedicamentoUseCase {
    execute(criarMedicamentoDto: CriarMedicamentoDto, tenantId: string, userId: string): Promise<MedicamentoEntity>;
}

export class CriarMedicamento implements CriarMedicamentoUseCase {
    constructor(private readonly medicamentoRepository: MedicamentoRepository) {}

    async execute(criarMedicamentoDto: CriarMedicamentoDto, tenantId: string, userId: string): Promise<MedicamentoEntity> {
        // Verificar se código EAN já existe (se fornecido)
        if (criarMedicamentoDto.codigo_ean) {
            const medicamentoExistente = await this.medicamentoRepository.buscarPorCodigoEan(criarMedicamentoDto.codigo_ean, tenantId);
            if (medicamentoExistente) {
                throw CustomError.badRequest('Código EAN já existe neste município');
            }
        }

        return await this.medicamentoRepository.criar(criarMedicamentoDto, tenantId, userId);
    }
}