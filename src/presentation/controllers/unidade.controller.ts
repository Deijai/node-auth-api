// presentation/controllers/unidade.controller.ts
import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { AtualizarUnidadeDto } from '../../domain/dtos/unidade/atualizar-unidade.dto';
import { BuscarUnidadeDto } from '../../domain/dtos/unidade/buscar-unidade.dto';
import { CriarUnidadeDto } from '../../domain/dtos/unidade/criar-unidade.dto';
import { UnidadeRepository } from '../../domain/repositories/unidade.repository';
import { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import { BuscarUnidadesProximas } from '../../domain/use-cases/documento/buscar-unidades-proximas.use-case';
import { CriarUnidade } from '../../domain/use-cases/documento/criar-unidade.use-case';

export class UnidadeController {
    constructor(
        private readonly unidadeRepository: UnidadeRepository,
        private readonly usuarioRepository: UsuarioRepository
    ) {}

    criarUnidade = (req: Request, res: Response) => {
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

    buscarUnidades = (req: Request, res: Response) => {
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

    buscarUnidadePorId = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.unidadeRepository.buscarPorId(id, tenantId)
            .then(unidade => {
                if (!unidade) {
                    return res.status(404).json({ error: 'Unidade não encontrada' });
                }
                res.json(unidade);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarUnidadesPorTipo = (req: Request, res: Response) => {
        const { tipo } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.unidadeRepository.buscarPorTipo(tipo, tenantId)
            .then(unidades => res.json(unidades))
            .catch(error => this.handleError(error, res));
    };

    buscarUnidadesPorEspecialidade = (req: Request, res: Response) => {
        const { especialidade } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.unidadeRepository.buscarPorEspecialidade(especialidade, tenantId)
            .then(unidades => res.json(unidades))
            .catch(error => this.handleError(error, res));
    };

    buscarUnidadesProximas = (req: Request, res: Response) => {
        const { latitude, longitude, raio } = req.query;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude e longitude são obrigatórias' });
        }

        const lat = parseFloat(latitude as string);
        const lng = parseFloat(longitude as string);
        const raioKm = raio ? parseFloat(raio as string) : 10; // Default 10km

        if (isNaN(lat) || isNaN(lng) || isNaN(raioKm)) {
            return res.status(400).json({ error: 'Coordenadas ou raio inválidos' });
        }

        new BuscarUnidadesProximas(this.unidadeRepository)
            .execute(lat, lng, raioKm, tenantId)
            .then(unidades => res.json(unidades))
            .catch(error => this.handleError(error, res));
    };

    obterEstatisticasUnidade = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.unidadeRepository.obterEstatisticas(id, tenantId)
            .then(estatisticas => res.json(estatisticas))
            .catch(error => this.handleError(error, res));
    };

    atualizarUnidade = (req: Request, res: Response) => {
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

    deletarUnidade = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.unidadeRepository.deletar(id, tenantId)
            .then(deletado => {
                if (!deletado) {
                    return res.status(404).json({ error: 'Unidade não encontrada' });
                }
                res.json({ message: 'Unidade deletada com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error('Erro unidade controller:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    };
}