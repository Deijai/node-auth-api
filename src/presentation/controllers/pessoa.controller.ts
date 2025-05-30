// presentation/controllers/pessoa.controller.ts
import { Request, Response } from 'express';
import {
    CustomError, CriarPessoaDto,
    BuscarPessoaDto, AtualizarPessoaDto
} from '../../domain';
import { PessoaRepository } from '../../domain/repositories/pessoa.repository';
import { CriarPessoa } from '../../domain/use-cases/pessoa/criar-pessoa.use-case';
import { BuscarPessoa } from '../../domain/use-cases/pessoa/buscar-pessoa.use-case';
import { AtualizarPessoa } from '../../domain/use-cases/pessoa/atualizar-pessoa.use-case';

export class PessoaController {
    constructor(private readonly pessoaRepository: PessoaRepository) { }

    criarPessoa = (req: Request, res: Response) => {
        const [error, criarPessoaDto] = CriarPessoaDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new CriarPessoa(this.pessoaRepository)
            .execute(criarPessoaDto!, tenantId, userId)
            .then(pessoa => res.status(201).json(pessoa))
            .catch(error => this.handleError(error, res));
    };

    buscarPessoas = (req: Request, res: Response) => {
        const [error, buscarPessoaDto] = BuscarPessoaDto.create(req.query);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;

        new BuscarPessoa(this.pessoaRepository)
            .execute(buscarPessoaDto!, tenantId)
            .then(resultado => res.json(resultado))
            .catch(error => this.handleError(error, res));
    };

    buscarPessoaPorId = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.pessoaRepository.buscarPorId(id, tenantId)
            .then(pessoa => {
                if (!pessoa) {
                    return res.status(404).json({ error: 'Pessoa não encontrada' });
                }
                res.json(pessoa);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarPessoaPorCpf = (req: Request, res: Response) => {
        const { cpf } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.pessoaRepository.buscarPorCpf(cpf, tenantId)
            .then(pessoa => {
                if (!pessoa) {
                    return res.status(404).json({ error: 'Pessoa não encontrada' });
                }
                res.json(pessoa);
            })
            .catch(error => this.handleError(error, res));
    };

    atualizarPessoa = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, atualizarPessoaDto] = AtualizarPessoaDto.create(req.body);

        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new AtualizarPessoa(this.pessoaRepository)
            .execute(id, atualizarPessoaDto!, tenantId, userId)
            .then(pessoa => res.json(pessoa))
            .catch(error => this.handleError(error, res));
    };

    deletarPessoa = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.pessoaRepository.deletar(id, tenantId)
            .then(deletado => {
                if (!deletado) {
                    return res.status(404).json({ error: 'Pessoa não encontrada' });
                }
                res.json({ message: 'Pessoa deletada com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error('Erro pessoa controller:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    };
}