// presentation/controllers/agendamento.controller.ts
import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { AtualizarAgendamentoDto } from '../../domain/dtos/agendamento/atualizar-agendamento.dto';
import { BuscarAgendamentoDto } from '../../domain/dtos/agendamento/buscar-agendamento.dto';
import { CancelarAgendamentoDto } from '../../domain/dtos/agendamento/cancelar-agendamento.dto';
import { CriarAgendamentoDto } from '../../domain/dtos/agendamento/criar-agendamento.dto';
import { AgendamentoRepository } from '../../domain/repositories/agendamento.repository';
import { MedicoRepository } from '../../domain/repositories/medico.repository';
import { PacienteRepository } from '../../domain/repositories/paciente.repository';
import { UnidadeRepository } from '../../domain/repositories/unidade.repository';
import { CriarAgendamento } from '../../domain/use-cases/agendamento/criar-agendamento.use-case';
import { Reagendar } from '../../domain/use-cases/agendamento/reagendar.use-case';

export class AgendamentoController {
    constructor(
        private readonly agendamentoRepository: AgendamentoRepository,
        private readonly pacienteRepository: PacienteRepository,
        private readonly medicoRepository: MedicoRepository,
        private readonly unidadeRepository: UnidadeRepository
    ) {}

    criarAgendamento = (req: Request, res: Response) => {
        const [error, criarAgendamentoDto] = CriarAgendamentoDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new CriarAgendamento(this.agendamentoRepository, this.pacienteRepository, this.medicoRepository, this.unidadeRepository)
            .execute(criarAgendamentoDto!, tenantId, userId)
            .then(agendamento => res.status(201).json(agendamento))
            .catch(error => this.handleError(error, res));
    };

    buscarAgendamentos = (req: Request, res: Response) => {
        const [error, buscarAgendamentoDto] = BuscarAgendamentoDto.create(req.query);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.agendamentoRepository.buscar(buscarAgendamentoDto!, tenantId)
            .then(resultado => res.json(resultado))
            .catch(error => this.handleError(error, res));
    };

    buscarAgendamentoPorId = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.agendamentoRepository.buscarPorId(id, tenantId)
            .then(agendamento => {
                if (!agendamento) {
                    return res.status(404).json({ error: 'Agendamento não encontrado' });
                }
                res.json(agendamento);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarAgendamentosPorPaciente = (req: Request, res: Response) => {
        const { pacienteId } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.agendamentoRepository.buscarPorPaciente(pacienteId, tenantId)
            .then(agendamentos => res.json(agendamentos))
            .catch(error => this.handleError(error, res));
    };

    buscarAgendaDia = (req: Request, res: Response) => {
        const { medicoId } = req.params;
        const { data } = req.query;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        if (!data) {
            return res.status(400).json({ error: 'Data é obrigatória' });
        }

        const dataConsulta = new Date(data as string);
        if (isNaN(dataConsulta.getTime())) {
            return res.status(400).json({ error: 'Data inválida' });
        }

        this.agendamentoRepository.buscarAgendaDia(medicoId, dataConsulta, tenantId)
            .then(agenda => res.json(agenda))
            .catch(error => this.handleError(error, res));
    };

    obterHorariosDisponiveis = (req: Request, res: Response) => {
        const { medicoId } = req.params;
        const { data } = req.query;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        if (!data) {
            return res.status(400).json({ error: 'Data é obrigatória' });
        }

        const dataConsulta = new Date(data as string);
        if (isNaN(dataConsulta.getTime())) {
            return res.status(400).json({ error: 'Data inválida' });
        }

        this.agendamentoRepository.obterHorariosDisponiveis(medicoId, dataConsulta, tenantId)
            .then(horarios => res.json(horarios))
            .catch(error => this.handleError(error, res));
    };

    atualizarAgendamento = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, atualizarAgendamentoDto] = AtualizarAgendamentoDto.create(req.body);
        
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        this.agendamentoRepository.atualizar(id, atualizarAgendamentoDto!, tenantId, userId)
            .then(agendamento => res.json(agendamento))
            .catch(error => this.handleError(error, res));
    };

    confirmarAgendamento = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        this.agendamentoRepository.confirmar(id, tenantId, userId)
            .then(confirmado => {
                if (!confirmado) {
                    return res.status(404).json({ error: 'Agendamento não encontrado' });
                }
                res.json({ message: 'Agendamento confirmado com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    cancelarAgendamento = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, cancelarAgendamentoDto] = CancelarAgendamentoDto.create(req.body);
        
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        this.agendamentoRepository.cancelar(id, cancelarAgendamentoDto!, tenantId, userId)
            .then(cancelado => {
                if (!cancelado) {
                    return res.status(404).json({ error: 'Agendamento não encontrado' });
                }
                res.json({ message: 'Agendamento cancelado com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    reagendarAgendamento = (req: Request, res: Response) => {
        const { id } = req.params;
        const { nova_data_hora } = req.body;
        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        if (!nova_data_hora) {
            return res.status(400).json({ error: 'Nova data e hora são obrigatórias' });
        }

        const novaDataHora = new Date(nova_data_hora);
        if (isNaN(novaDataHora.getTime())) {
            return res.status(400).json({ error: 'Nova data e hora inválidas' });
        }

        new Reagendar(this.agendamentoRepository)
            .execute(id, novaDataHora, tenantId, userId)
            .then(agendamento => res.json(agendamento))
            .catch(error => this.handleError(error, res));
    };

    marcarRealizado = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        this.agendamentoRepository.marcarRealizado(id, tenantId, userId)
            .then(marcado => {
                if (!marcado) {
                    return res.status(404).json({ error: 'Agendamento não encontrado' });
                }
                res.json({ message: 'Agendamento marcado como realizado' });
            })
            .catch(error => this.handleError(error, res));
    };

    buscarProximosLembretes = (req: Request, res: Response) => {
        const { horas } = req.query;
        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const horasAntecedencia = horas ? parseInt(horas as string) : 24;

        this.agendamentoRepository.buscarProximosLembretes(tenantId, horasAntecedencia)
            .then(agendamentos => res.json(agendamentos))
            .catch(error => this.handleError(error, res));
    };

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error('Erro agendamento controller:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    };
}