// domain/use-cases/agendamento/reagendar.use-case.ts
import { AgendamentoRepository } from '../../repositories/agendamento.repository';
import { AgendamentoEntity } from '../../entities/agendamento.entity';
import { CustomError } from '../../errors/custom.error';

interface ReagendarUseCase {
    execute(agendamentoId: string, novaDataHora: Date, tenantId: string, userId: string): Promise<AgendamentoEntity>;
}

export class Reagendar implements ReagendarUseCase {
    constructor(private readonly agendamentoRepository: AgendamentoRepository) {}

    async execute(agendamentoId: string, novaDataHora: Date, tenantId: string, userId: string): Promise<AgendamentoEntity> {
        // Verificar se agendamento existe
        const agendamento = await this.agendamentoRepository.buscarPorId(agendamentoId, tenantId);
        if (!agendamento) {
            throw CustomError.notfound('Agendamento não encontrado');
        }

        // Verificar se pode reagendar
        if (!agendamento.podeReagendar()) {
            throw CustomError.badRequest('Agendamento não pode ser reagendado no status atual');
        }

        // Verificar disponibilidade na nova data (se médico especificado)
        if (agendamento.medico_id) {
            const disponivel = await this.agendamentoRepository.verificarDisponibilidade(
                agendamento.medico_id,
                novaDataHora,
                agendamento.duracao_estimada,
                tenantId,
                agendamentoId // Excluir o próprio agendamento da verificação
            );

            if (!disponivel) {
                throw CustomError.badRequest('Médico não disponível no novo horário');
            }
        }

        return await this.agendamentoRepository.reagendar(agendamentoId, novaDataHora, tenantId, userId);
    }
}