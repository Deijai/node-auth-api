// domain/use-cases/paciente/atualizar-paciente.use-case.ts
import { PacienteRepository } from '../../repositories/paciente.repository';
import { AtualizarPacienteDto } from '../../dtos/paciente/atualizar-paciente.dto';
import { PacienteEntity } from '../../entities/paciente.entity';
import { CustomError } from '../../errors/custom.error';

interface AtualizarPacienteUseCase {
    execute(id: string, atualizarPacienteDto: AtualizarPacienteDto, tenantId: string, userId: string): Promise<PacienteEntity>;
}

export class AtualizarPaciente implements AtualizarPacienteUseCase {
    constructor(private readonly pacienteRepository: PacienteRepository) {}

    async execute(id: string, atualizarPacienteDto: AtualizarPacienteDto, tenantId: string, userId: string): Promise<PacienteEntity> {
        // Verificar se paciente existe
        const pacienteExistente = await this.pacienteRepository.buscarPorId(id, tenantId);
        if (!pacienteExistente) {
            throw CustomError.notfound('Paciente não encontrado');
        }

        // Verificar se cartão SUS já existe em outro paciente (se fornecido)
        if (atualizarPacienteDto.numero_cartao_sus) {
            const pacienteComCartao = await this.pacienteRepository.buscarPorCartaoSus(atualizarPacienteDto.numero_cartao_sus, tenantId);
            if (pacienteComCartao && pacienteComCartao.id !== id) {
                throw CustomError.badRequest('Cartão SUS já cadastrado para outro paciente');
            }
        }

        return await this.pacienteRepository.atualizar(id, atualizarPacienteDto, tenantId, userId);
    }
}