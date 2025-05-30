// domain/use-cases/consulta/criar-consulta.use-case.ts
import { ConsultaRepository } from '../../repositories/consulta.repository';
import { PacienteRepository } from '../../repositories/paciente.repository';
import { MedicoRepository } from '../../repositories/medico.repository';
import { UnidadeRepository } from '../../repositories/unidade.repository';
import { CriarConsultaDto } from '../../dtos/consulta/criar-consulta.dto';
import { ConsultaEntity } from '../../entities/consulta.entity';
import { CustomError } from '../../errors/custom.error';

interface CriarConsultaUseCase {
    execute(criarConsultaDto: CriarConsultaDto, tenantId: string, userId: string): Promise<ConsultaEntity>;
}

export class CriarConsulta implements CriarConsultaUseCase {
    constructor(
        private readonly consultaRepository: ConsultaRepository,
        private readonly pacienteRepository: PacienteRepository,
        private readonly medicoRepository: MedicoRepository,
        private readonly unidadeRepository: UnidadeRepository
    ) {}

    async execute(criarConsultaDto: CriarConsultaDto, tenantId: string, userId: string): Promise<ConsultaEntity> {
        // Verificar se paciente existe
        const paciente = await this.pacienteRepository.buscarPorId(criarConsultaDto.paciente_id, tenantId);
        if (!paciente) {
            throw CustomError.badRequest('Paciente não encontrado');
        }

        // Verificar se médico existe
        const medico = await this.medicoRepository.buscarPorId(criarConsultaDto.medico_id, tenantId);
        if (!medico) {
            throw CustomError.badRequest('Médico não encontrado');
        }

        // Verificar se unidade existe
        const unidade = await this.unidadeRepository.buscarPorId(criarConsultaDto.unidade_id, tenantId);
        if (!unidade) {
            throw CustomError.badRequest('Unidade não encontrada');
        }

        // Verificar disponibilidade do médico
        const disponivel = await this.consultaRepository.verificarDisponibilidade(
            criarConsultaDto.medico_id,
            criarConsultaDto.data_hora_agendada,
            30, // duração padrão
            tenantId
        );

        if (!disponivel) {
            throw CustomError.badRequest('Médico não disponível neste horário');
        }

        return await this.consultaRepository.criar(criarConsultaDto, tenantId, userId);
    }
}