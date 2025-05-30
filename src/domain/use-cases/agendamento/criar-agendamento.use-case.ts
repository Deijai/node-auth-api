// domain/use-cases/agendamento/criar-agendamento.use-case.ts
import { AgendamentoRepository } from '../../repositories/agendamento.repository';
import { PacienteRepository } from '../../repositories/paciente.repository';
import { MedicoRepository } from '../../repositories/medico.repository';
import { UnidadeRepository } from '../../repositories/unidade.repository';
import { CriarAgendamentoDto } from '../../dtos/agendamento/criar-agendamento.dto';
import { AgendamentoEntity } from '../../entities/agendamento.entity';
import { CustomError } from '../../errors/custom.error';

interface CriarAgendamentoUseCase {
    execute(criarAgendamentoDto: CriarAgendamentoDto, tenantId: string, userId: string): Promise<AgendamentoEntity>;
}

export class CriarAgendamento implements CriarAgendamentoUseCase {
    constructor(
        private readonly agendamentoRepository: AgendamentoRepository,
        private readonly pacienteRepository: PacienteRepository,
        private readonly medicoRepository: MedicoRepository,
        private readonly unidadeRepository: UnidadeRepository
    ) {}

    async execute(criarAgendamentoDto: CriarAgendamentoDto, tenantId: string, userId: string): Promise<AgendamentoEntity> {
        // Verificar se paciente existe
        const paciente = await this.pacienteRepository.buscarPorId(criarAgendamentoDto.paciente_id, tenantId);
        if (!paciente) {
            throw CustomError.badRequest('Paciente não encontrado');
        }

        // Verificar se médico existe (se fornecido)
        if (criarAgendamentoDto.medico_id) {
            const medico = await this.medicoRepository.buscarPorId(criarAgendamentoDto.medico_id, tenantId);
            if (!medico) {
                throw CustomError.badRequest('Médico não encontrado');
            }
        }

        // Verificar se unidade existe
        const unidade = await this.unidadeRepository.buscarPorId(criarAgendamentoDto.unidade_id, tenantId);
        if (!unidade) {
            throw CustomError.badRequest('Unidade não encontrada');
        }

        // Verificar disponibilidade (se médico especificado)
        if (criarAgendamentoDto.medico_id) {
            const disponivel = await this.agendamentoRepository.verificarDisponibilidade(
                criarAgendamentoDto.medico_id,
                criarAgendamentoDto.data_hora,
                criarAgendamentoDto.duracao_estimada,
                tenantId
            );

            if (!disponivel) {
                throw CustomError.badRequest('Médico não disponível neste horário');
            }
        }

        return await this.agendamentoRepository.criar(criarAgendamentoDto, tenantId, userId);
    }
}