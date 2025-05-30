// presentation/controllers/consulta.controller.ts
import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { BuscarConsultaDto } from '../../domain/dtos/consulta/buscar-consulta.dto';
import { CriarConsultaDto } from '../../domain/dtos/consulta/criar-consulta.dto';
import { FinalizarConsultaDto } from '../../domain/dtos/consulta/finalizar-consulta.dto';
import { IniciarAtendimentoDto } from '../../domain/dtos/consulta/iniciar-atendimento.dto';
import { ConsultaRepository } from '../../domain/repositories/consulta.repository';
import { MedicoRepository } from '../../domain/repositories/medico.repository';
import { PacienteRepository } from '../../domain/repositories/paciente.repository';
import { UnidadeRepository } from '../../domain/repositories/unidade.repository';
import { CriarConsulta } from '../../domain/use-cases/consulta/criar-consulta.use-case';
import { FinalizarConsulta } from '../../domain/use-cases/consulta/finalizar-consulta.use-case';
import { IniciarAtendimento } from '../../domain/use-cases/consulta/iniciar-atendimento.use-case';

export class ConsultaController {
    constructor(
        private readonly consultaRepository: ConsultaRepository,
        private readonly pacienteRepository: PacienteRepository,
        private readonly medicoRepository: MedicoRepository,
        private readonly unidadeRepository: UnidadeRepository
    ) {}

    criarConsulta = (req: Request, res: Response) => {
        const [error, criarConsultaDto] = CriarConsultaDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new CriarConsulta(this.consultaRepository, this.pacienteRepository, this.medicoRepository, this.unidadeRepository)
            .execute(criarConsultaDto!, tenantId, userId)
            .then(consulta => res.status(201).json(consulta))
            .catch(error => this.handleError(error, res));
    };

    buscarConsultas = (req: Request, res: Response) => {
        const [error, buscarConsultaDto] = BuscarConsultaDto.create(req.query);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.consultaRepository.buscar(buscarConsultaDto!, tenantId)
            .then(resultado => res.json(resultado))
            .catch(error => this.handleError(error, res));
    };

    buscarConsultaPorId = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.consultaRepository.buscarPorId(id, tenantId)
            .then(consulta => {
                if (!consulta) {
                    return res.status(404).json({ error: 'Consulta não encontrada' });
                }
                res.json(consulta);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarConsultasPorPaciente = (req: Request, res: Response) => {
        const { pacienteId } = req.params;
        const { limit } = req.query;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.consultaRepository.buscarPorPaciente(pacienteId, tenantId, limit ? parseInt(limit as string) : undefined)
            .then(consultas => res.json(consultas))
            .catch(error => this.handleError(error, res));
    };

    buscarAgendaMedico = (req: Request, res: Response) => {
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

        this.consultaRepository.buscarPorMedico(medicoId, dataConsulta, tenantId)
            .then(consultas => res.json(consultas))
            .catch(error => this.handleError(error, res));
    };

    buscarAgendaUnidade = (req: Request, res: Response) => {
        const { unidadeId } = req.params;
        const { data } = req.query;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        if (!data) {
            return res.status(400).json({ error: 'Data é obrigatória' });
        }

        const dataConsulta = new Date(data as string);
        if (isNaN(dataConsulta.getTime())) {
            return res.status(400).json({ error: 'Data inválida' });
        }

        this.consultaRepository.buscarAgendaUnidade(unidadeId, dataConsulta, tenantId)
            .then(consultas => res.json(consultas))
            .catch(error => this.handleError(error, res));
    };

    iniciarAtendimento = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, iniciarAtendimentoDto] = IniciarAtendimentoDto.create(req.body);
        
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new IniciarAtendimento(this.consultaRepository)
            .execute(id, iniciarAtendimentoDto!, tenantId, userId)
            .then(consulta => res.json(consulta))
            .catch(error => this.handleError(error, res));
    };

    finalizarConsulta = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, finalizarConsultaDto] = FinalizarConsultaDto.create(req.body);
        
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new FinalizarConsulta(this.consultaRepository)
            .execute(id, finalizarConsultaDto!, tenantId, userId)
            .then(consulta => res.json(consulta))
            .catch(error => this.handleError(error, res));
    };

    cancelarConsulta = (req: Request, res: Response) => {
        const { id } = req.params;
        const { motivo } = req.body;
        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        if (!motivo) {
            return res.status(400).json({ error: 'Motivo do cancelamento é obrigatório' });
        }

        this.consultaRepository.cancelarConsulta(id, motivo, tenantId, userId)
            .then(cancelado => {
                if (!cancelado) {
                    return res.status(404).json({ error: 'Consulta não encontrada' });
                }
                res.json({ message: 'Consulta cancelada com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    marcarNaoCompareceu = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        this.consultaRepository.marcarNaoCompareceu(id, tenantId, userId)
            .then(marcado => {
                if (!marcado) {
                    return res.status(404).json({ error: 'Consulta não encontrada' });
                }
                res.json({ message: 'Consulta marcada como não compareceu' });
            })
            .catch(error => this.handleError(error, res));
    };

    obterEstatisticas = (req: Request, res: Response) => {
        const { unidadeId } = req.params;
        const { data_inicio, data_fim } = req.query;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        const dataInicio = data_inicio ? new Date(data_inicio as string) : new Date(new Date().setDate(1));
        const dataFim = data_fim ? new Date(data_fim as string) : new Date();

        this.consultaRepository.obterEstatisticas(unidadeId, dataInicio, dataFim, tenantId)
            .then(estatisticas => res.json(estatisticas))
            .catch(error => this.handleError(error, res));
    };

    verificarDisponibilidade = (req: Request, res: Response) => {
        const { medicoId, dataHora, duracao } = req.query;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        if (!medicoId || !dataHora) {
            return res.status(400).json({ error: 'Médico e data/hora são obrigatórios' });
        }

        const dataHoraDate = new Date(dataHora as string);
        if (isNaN(dataHoraDate.getTime())) {
            return res.status(400).json({ error: 'Data e hora inválidas' });
        }

        const duracaoNum = parseInt(duracao as string) || 30;

        this.consultaRepository.verificarDisponibilidade(medicoId as string, dataHoraDate, duracaoNum, tenantId)
            .then(disponivel => res.json({ disponivel }))
            .catch(error => this.handleError(error, res));
    };

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error('Erro consulta controller:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    };
}