// domain/use-cases/consulta/iniciar-atendimento.use-case.ts
import { ConsultaRepository } from '../../repositories/consulta.repository';
import { IniciarAtendimentoDto } from '../../dtos/consulta/iniciar-atendimento.dto';
import { ConsultaEntity } from '../../entities/consulta.entity';
import { CustomError } from '../../errors/custom.error';

interface IniciarAtendimentoUseCase {
    execute(consultaId: string, iniciarAtendimentoDto: IniciarAtendimentoDto, tenantId: string, userId: string): Promise<ConsultaEntity>;
}

export class IniciarAtendimento implements IniciarAtendimentoUseCase {
    constructor(private readonly consultaRepository: ConsultaRepository) {}

    async execute(consultaId: string, iniciarAtendimentoDto: IniciarAtendimentoDto, tenantId: string, userId: string): Promise<ConsultaEntity> {
        // Verificar se consulta existe
        const consulta = await this.consultaRepository.buscarPorId(consultaId, tenantId);
        if (!consulta) {
            throw CustomError.notfound('Consulta não encontrada');
        }

        // Verificar se pode iniciar atendimento
        if (!consulta.podeIniciarAtendimento()) {
            throw CustomError.badRequest('Consulta não pode ser iniciada no status atual');
        }

        return await this.consultaRepository.iniciarAtendimento(consultaId, iniciarAtendimentoDto, tenantId, userId);
    }
}