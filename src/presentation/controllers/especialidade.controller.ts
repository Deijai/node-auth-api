// presentation/controllers/especialidade.controller.ts
import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { AtualizarEspecialidadeDto } from '../../domain/dtos/especialidade/atualizar-especialidade.dto';
import { BuscarEspecialidadeDto } from '../../domain/dtos/especialidade/buscar-especialidade.dto';
import { CriarEspecialidadeDto } from '../../domain/dtos/especialidade/criar-especialidade.dto';
import { EspecialidadeRepository } from '../../domain/repositories/especialidade.repository';

export class EspecialidadeController {
    constructor(private readonly especialidadeRepository: EspecialidadeRepository) {}

    criarEspecialidade = (req: Request, res: Response) => {
        const [error, criarEspecialidadeDto] = CriarEspecialidadeDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        this.especialidadeRepository.criar(criarEspecialidadeDto!, tenantId, userId)
            .then(especialidade => res.status(201).json(especialidade))
            .catch(error => this.handleError(error, res));
    };

    buscarEspecialidades = (req: Request, res: Response) => {
        const [error, buscarEspecialidadeDto] = BuscarEspecialidadeDto.create(req.query);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.especialidadeRepository.buscar(buscarEspecialidadeDto!, tenantId)
            .then(resultado => res.json(resultado))
            .catch(error => this.handleError(error, res));
    };

    buscarEspecialidadePorId = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.especialidadeRepository.buscarPorId(id, tenantId)
            .then(especialidade => {
                if (!especialidade) {
                    return res.status(404).json({ error: 'Especialidade não encontrada' });
                }
                res.json(especialidade);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarEspecialidadePorCodigo = (req: Request, res: Response) => {
        const { codigo } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.especialidadeRepository.buscarPorCodigo(codigo, tenantId)
            .then(especialidade => {
                if (!especialidade) {
                    return res.status(404).json({ error: 'Especialidade não encontrada' });
                }
                res.json(especialidade);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarEspecialidadesPorArea = (req: Request, res: Response) => {
        const { area } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.especialidadeRepository.buscarPorArea(area, tenantId)
            .then(especialidades => res.json(especialidades))
            .catch(error => this.handleError(error, res));
    };

    buscarEspecialidadesAtivas = (req: Request, res: Response) => {
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.especialidadeRepository.buscarAtivas(tenantId)
            .then(especialidades => res.json(especialidades))
            .catch(error => this.handleError(error, res));
    };

    atualizarEspecialidade = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, atualizarEspecialidadeDto] = AtualizarEspecialidadeDto.create(req.body);
        
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        this.especialidadeRepository.atualizar(id, atualizarEspecialidadeDto!, tenantId, userId)
            .then(especialidade => res.json(especialidade))
            .catch(error => this.handleError(error, res));
    };

    ativarEspecialidade = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        this.especialidadeRepository.ativar(id, tenantId, userId)
            .then(ativado => {
                if (!ativado) {
                    return res.status(404).json({ error: 'Especialidade não encontrada' });
                }
                res.json({ message: 'Especialidade ativada com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    desativarEspecialidade = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        this.especialidadeRepository.desativar(id, tenantId, userId)
            .then(desativado => {
                if (!desativado) {
                    return res.status(404).json({ error: 'Especialidade não encontrada' });
                }
                res.json({ message: 'Especialidade desativada com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    deletarEspecialidade = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.especialidadeRepository.deletar(id, tenantId)
            .then(deletado => {
                if (!deletado) {
                    return res.status(404).json({ error: 'Especialidade não encontrada' });
                }
                res.json({ message: 'Especialidade deletada com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error('Erro especialidade controller:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    };
}