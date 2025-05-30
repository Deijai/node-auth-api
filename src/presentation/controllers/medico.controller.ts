// presentation/controllers/medico.controller.ts
import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { AtualizarMedicoDto } from '../../domain/dtos/medico/atualizar-medico.dto';
import { BuscarMedicoDto } from '../../domain/dtos/medico/buscar-medico.dto';
import { CriarMedicoCompletoDto } from '../../domain/dtos/medico/criar-medico-completo.dto';
import { CriarMedicoDto } from '../../domain/dtos/medico/criar-medico.dto';
import { MedicoRepository } from '../../domain/repositories/medico.repository';
import { PessoaRepository } from '../../domain/repositories/pessoa.repository';
import { AtualizarMedico } from '../../domain/use-cases/medico/atualizar-medico.use-case';
import { BuscarMedico } from '../../domain/use-cases/medico/buscar-medico.use-case';
import { CriarMedicoCompleto } from '../../domain/use-cases/medico/criar-medico-completo.use-case';
import { CriarMedico } from '../../domain/use-cases/medico/criar-medico.use-case';

export class MedicoController {
    constructor(
        private readonly medicoRepository: MedicoRepository,
        private readonly pessoaRepository: PessoaRepository
    ) {}

    criarMedico = (req: Request, res: Response): void => {
        const [error, criarMedicoDto] = CriarMedicoDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new CriarMedico(this.medicoRepository, this.pessoaRepository)
            .execute(criarMedicoDto!, tenantId, userId)
            .then(medico => res.status(201).json(medico))
            .catch(error => this.handleError(error, res));
    };

    criarMedicoCompleto = (req: Request, res: Response): void => {
        const [error, criarMedicoCompletoDto] = CriarMedicoCompletoDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new CriarMedicoCompleto(this.medicoRepository, this.pessoaRepository)
            .execute(criarMedicoCompletoDto!, tenantId, userId)
            .then(medico => res.status(201).json(medico))
            .catch(error => this.handleError(error, res));
    };

    buscarMedicos = (req: Request, res: Response): void => {
        const [error, buscarMedicoDto] = BuscarMedicoDto.create(req.query);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;

        new BuscarMedico(this.medicoRepository)
            .execute(buscarMedicoDto!, tenantId)
            .then(resultado => res.json(resultado))
            .catch(error => this.handleError(error, res));
    };

    buscarMedicoPorId = (req: Request, res: Response): void => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.medicoRepository.buscarPorId(id, tenantId)
            .then(medico => {
                if (!medico) {
                    res.status(404).json({ error: 'Médico não encontrado' });
                    return;
                }
                res.json(medico);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarMedicoPorCrm = (req: Request, res: Response): void => {
        const { crm } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.medicoRepository.buscarPorCrm(crm, tenantId)
            .then(medico => {
                if (!medico) {
                    res.status(404).json({ error: 'Médico não encontrado' });
                    return;
                }
                res.json(medico);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarMedicosPorUnidade = (req: Request, res: Response): void => {
        const { unidadeId } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.medicoRepository.buscarPorUnidade(unidadeId, tenantId)
            .then(medicos => res.json(medicos))
            .catch(error => this.handleError(error, res));
    };

    buscarMedicosPorEspecialidade = (req: Request, res: Response): void => {
        const { especialidade } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.medicoRepository.buscarPorEspecialidade(especialidade, tenantId)
            .then(medicos => res.json(medicos))
            .catch(error => this.handleError(error, res));
    };

    obterAgendaMedico = (req: Request, res: Response): void => {
        const { id } = req.params;
        const { data } = req.query;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        if (!data) {
            res.status(400).json({ error: 'Data é obrigatória' });
            return;
        }

        const dataConsulta = new Date(data as string);
        if (isNaN(dataConsulta.getTime())) {
            res.status(400).json({ error: 'Data inválida' });
            return;
        }

        this.medicoRepository.obterAgenda(id, dataConsulta, tenantId)
            .then(agenda => res.json({
                medico_id: id,
                data: dataConsulta,
                horarios: agenda
            }))
            .catch(error => this.handleError(error, res));
    };

    atualizarMedico = (req: Request, res: Response): void => {
        const { id } = req.params;
        const [error, atualizarMedicoDto] = AtualizarMedicoDto.create(req.body);
        
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new AtualizarMedico(this.medicoRepository)
            .execute(id, atualizarMedicoDto!, tenantId, userId)
            .then(medico => res.json(medico))
            .catch(error => this.handleError(error, res));
    };

    deletarMedico = (req: Request, res: Response): void => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.medicoRepository.deletar(id, tenantId)
            .then(deletado => {
                if (!deletado) {
                    res.status(404).json({ error: 'Médico não encontrado' });
                    return;
                }
                res.json({ message: 'Médico deletado com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    obterEstatisticasMedico = (req: Request, res: Response): void => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        // Implementar lógica para estatísticas (consultas realizadas, avaliações, etc.)
        this.medicoRepository.buscarPorId(id, tenantId)
            .then(medico => {
                if (!medico) {
                    res.status(404).json({ error: 'Médico não encontrado' });
                    return;
                }
                
                // Aqui você pode adicionar queries para buscar estatísticas
                res.json({
                    medico_id: medico.id,
                    nome: medico.pessoa?.nome,
                    especialidade: medico.especialidade,
                    crm: medico.crm,
                    unidades_vinculadas: medico.unidades_vinculadas?.length || 0,
                    aceita_convenio: medico.aceita_convenio,
                    valor_consulta: medico.valor_consulta,
                    // Adicionar mais estatísticas conforme necessário
                    consultas_mes_atual: 0, // Implementar query
                    avaliacao_media: 0, // Implementar sistema de avaliação
                    total_pacientes_atendidos: 0 // Implementar query
                });
            })
            .catch(error => this.handleError(error, res));
    };

    private handleError = (error: unknown, res: Response): void => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        console.error('Erro medico controller:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    };
}

// ========================================
// ALTERNATIVA: Usando async/await (mais limpa)
// ========================================

export class MedicoControllerAsync {
    constructor(
        private readonly medicoRepository: MedicoRepository,
        private readonly pessoaRepository: PessoaRepository
    ) {}

    criarMedico = async (req: Request, res: Response): Promise<void> => {
        try {
            const [error, criarMedicoDto] = CriarMedicoDto.create(req.body);
            if (error) {
                res.status(400).json({ error });
                return;
            }

            const tenantId = req.body.tenant?.id || req.body.tenantId;
            const userId = req.body.user?.id || req.body.userId;

            const medico = await new CriarMedico(this.medicoRepository, this.pessoaRepository)
                .execute(criarMedicoDto!, tenantId, userId);
            
            res.status(201).json(medico);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    buscarMedicoPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const tenantId = req.body.tenant?.id || req.body.tenantId;

            const medico = await this.medicoRepository.buscarPorId(id, tenantId);
            if (!medico) {
                res.status(404).json({ error: 'Médico não encontrado' });
                return;
            }
            
            res.json(medico);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    obterAgendaMedico = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { data } = req.query;
            const tenantId = req.body.tenant?.id || req.body.tenantId;

            if (!data) {
                res.status(400).json({ error: 'Data é obrigatória' });
                return;
            }

            const dataConsulta = new Date(data as string);
            if (isNaN(dataConsulta.getTime())) {
                res.status(400).json({ error: 'Data inválida' });
                return;
            }

            const agenda = await this.medicoRepository.obterAgenda(id, dataConsulta, tenantId);
            res.json({
                medico_id: id,
                data: dataConsulta,
                horarios: agenda
            });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError = (error: unknown, res: Response): void => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        console.error('Erro medico controller:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    };
}