// domain/use-cases/consulta/finalizar-consulta.use-case.ts
import { ConsultaRepository } from '../../repositories/consulta.repository';
import { FinalizarConsultaDto } from '../../dtos/consulta/finalizar-consulta.dto';
import { ConsultaEntity } from '../../entities/consulta.entity';
import { CustomError } from '../../errors/custom.error';

interface FinalizarConsultaUseCase {
    execute(consultaId: string, finalizarConsultaDto: FinalizarConsultaDto, tenantId: string, userId: string): Promise<ConsultaEntity>;
}

export class FinalizarConsulta implements FinalizarConsultaUseCase {
    constructor(private readonly consultaRepository: ConsultaRepository) {}

    async execute(consultaId: string, finalizarConsultaDto: FinalizarConsultaDto, tenantId: string, userId: string): Promise<ConsultaEntity> {
        // Verificar se consulta existe
        const consulta = await this.consultaRepository.buscarPorId(consultaId, tenantId);
        if (!consulta) {
            throw CustomError.notfound('Consulta não encontrada');
        }

        // Verificar se consulta está em andamento
        if (consulta.status !== 'EM_ANDAMENTO') {
            throw CustomError.badRequest('Apenas consultas em andamento podem ser finalizadas');
        }

        return await this.consultaRepository.finalizarConsulta(consultaId, finalizarConsultaDto, tenantId, userId);
    }
}