// presentation/controllers/unidade.controller.ts
import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { AtualizarUnidadeDto } from '../../domain/dtos/unidade/atualizar-unidade.dto';
import { BuscarUnidadeDto } from '../../domain/dtos/unidade/buscar-unidade.dto';
import { CriarUnidadeDto } from '../../domain/dtos/unidade/criar-unidade.dto';
import { UnidadeRepository } from '../../domain/repositories/unidade.repository';
import { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import { CriarUnidade } from '../../domain/use-cases/documento/criar-unidade.use-case';
import { BuscarUnidadesProximas } from '../../domain/use-cases/documento/buscar-unidades-proximas.use-case';

export class UnidadeController {
    constructor(
        private readonly unidadeRepository: UnidadeRepository,
        private readonly usuarioRepository: UsuarioRepository
    ) {}

    criarUnidade = (req: Request, res: Response): void => {
        const [error, criarUnidadeDto] = CriarUnidadeDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new CriarUnidade(this.unidadeRepository, this.usuarioRepository)
            .execute(criarUnidadeDto!, tenantId, userId)
            .then(unidade => res.status(201).json(unidade))
            .catch(error => this.handleError(error, res));
    };

    buscarUnidades = (req: Request, res: Response): void => {
        const [error, buscarUnidadeDto] = BuscarUnidadeDto.create(req.query);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.unidadeRepository.buscar(buscarUnidadeDto!, tenantId)
            .then(resultado => res.json(resultado))
            .catch(error => this.handleError(error, res));
    };

    buscarUnidadePorId = (req: Request, res: Response): void => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.unidadeRepository.buscarPorId(id, tenantId)
            .then(unidade => {
                if (!unidade) {
                    res.status(404).json({ error: 'Unidade não encontrada' });
                    return;
                }
                res.json(unidade);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarUnidadesPorTipo = (req: Request, res: Response): void => {
        const { tipo } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.unidadeRepository.buscarPorTipo(tipo, tenantId)
            .then(unidades => res.json(unidades))
            .catch(error => this.handleError(error, res));
    };

    buscarUnidadesPorEspecialidade = (req: Request, res: Response): void => {
        const { especialidade } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.unidadeRepository.buscarPorEspecialidade(especialidade, tenantId)
            .then(unidades => res.json(unidades))
            .catch(error => this.handleError(error, res));
    };

    buscarUnidadesProximas = (req: Request, res: Response): void => {
        const { latitude, longitude, raio } = req.query;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        if (!latitude || !longitude) {
            res.status(400).json({ error: 'Latitude e longitude são obrigatórias' });
            return;
        }

        const lat = parseFloat(latitude as string);
        const lng = parseFloat(longitude as string);
        const raioKm = raio ? parseFloat(raio as string) : 10; // Default 10km

        if (isNaN(lat) || isNaN(lng) || isNaN(raioKm)) {
            res.status(400).json({ error: 'Coordenadas ou raio inválidos' });
            return;
        }

        new BuscarUnidadesProximas(this.unidadeRepository)
            .execute(lat, lng, raioKm, tenantId)
            .then(unidades => res.json(unidades))
            .catch(error => this.handleError(error, res));
    };

    obterEstatisticasUnidade = (req: Request, res: Response): void => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.unidadeRepository.obterEstatisticas(id, tenantId)
            .then(estatisticas => res.json(estatisticas))
            .catch(error => this.handleError(error, res));
    };

    atualizarUnidade = (req: Request, res: Response): void => {
        const { id } = req.params;
        const [error, atualizarUnidadeDto] = AtualizarUnidadeDto.create(req.body);
        
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        this.unidadeRepository.atualizar(id, atualizarUnidadeDto!, tenantId, userId)
            .then(unidade => res.json(unidade))
            .catch(error => this.handleError(error, res));
    };

    deletarUnidade = (req: Request, res: Response): void => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.unidadeRepository.deletar(id, tenantId)
            .then(deletado => {
                if (!deletado) {
                    res.status(404).json({ error: 'Unidade não encontrada' });
                    return;
                }
                res.json({ message: 'Unidade deletada com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    private handleError = (error: unknown, res: Response): void => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        console.error('Erro unidade controller:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    };
}
