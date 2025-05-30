// presentation/controllers/medicamento.controller.ts
import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { AtualizarMedicamentoDto } from '../../domain/dtos/medicamento/atualizar-medicamento.dto';
import { BuscarMedicamentoDto } from '../../domain/dtos/medicamento/buscar-medicamento.dto';
import { CriarMedicamentoDto } from '../../domain/dtos/medicamento/criar-medicamento.dto';
import { MedicamentoRepository } from '../../domain/repositories/medicamento.repository';

export class MedicamentoController {
    constructor(private readonly medicamentoRepository: MedicamentoRepository) {}

    criarMedicamento = (req: Request, res: Response) => {
        const [error, criarMedicamentoDto] = CriarMedicamentoDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        this.medicamentoRepository.criar(criarMedicamentoDto!, tenantId, userId)
            .then(medicamento => res.status(201).json(medicamento))
            .catch(error => this.handleError(error, res));
    };

    buscarMedicamentos = (req: Request, res: Response) => {
        const [error, buscarMedicamentoDto] = BuscarMedicamentoDto.create(req.query);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.medicamentoRepository.buscar(buscarMedicamentoDto!, tenantId)
            .then(resultado => res.json(resultado))
            .catch(error => this.handleError(error, res));
    };

    buscarMedicamentoPorId = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.medicamentoRepository.buscarPorId(id, tenantId)
            .then(medicamento => {
                if (!medicamento) {
                    return res.status(404).json({ error: 'Medicamento não encontrado' });
                }
                res.json(medicamento);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarMedicamentoPorCodigoEan = (req: Request, res: Response) => {
        const { codigo } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.medicamentoRepository.buscarPorCodigoEan(codigo, tenantId)
            .then(medicamento => {
                if (!medicamento) {
                    return res.status(404).json({ error: 'Medicamento não encontrado' });
                }
                res.json(medicamento);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarMedicamentosControlados = (req: Request, res: Response) => {
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.medicamentoRepository.buscarControlados(tenantId)
            .then(medicamentos => res.json(medicamentos))
            .catch(error => this.handleError(error, res));
    };

    buscarMedicamentosDisponivelSus = (req: Request, res: Response) => {
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.medicamentoRepository.buscarDisponivelSus(tenantId)
            .then(medicamentos => res.json(medicamentos))
            .catch(error => this.handleError(error, res));
    };

    buscarMedicamentosAtivos = (req: Request, res: Response) => {
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.medicamentoRepository.buscarAtivos(tenantId)
            .then(medicamentos => res.json(medicamentos))
            .catch(error => this.handleError(error, res));
    };

    atualizarMedicamento = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, atualizarMedicamentoDto] = AtualizarMedicamentoDto.create(req.body);
        
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        this.medicamentoRepository.atualizar(id, atualizarMedicamentoDto!, tenantId, userId)
            .then(medicamento => res.json(medicamento))
            .catch(error => this.handleError(error, res));
    };

    ativarMedicamento = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        this.medicamentoRepository.ativar(id, tenantId, userId)
            .then(ativado => {
                if (!ativado) {
                    return res.status(404).json({ error: 'Medicamento não encontrado' });
                }
                res.json({ message: 'Medicamento ativado com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    desativarMedicamento = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        this.medicamentoRepository.desativar(id, tenantId, userId)
            .then(desativado => {
                if (!desativado) {
                    return res.status(404).json({ error: 'Medicamento não encontrado' });
                }
                res.json({ message: 'Medicamento desativado com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    deletarMedicamento = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.medicamentoRepository.deletar(id, tenantId)
            .then(deletado => {
                if (!deletado) {
                    return res.status(404).json({ error: 'Medicamento não encontrado' });
                }
                res.json({ message: 'Medicamento deletado com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error('Erro medicamento controller:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    };
}