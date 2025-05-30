// presentation/controllers/paciente.controller.ts
import { Request, Response } from 'express';
import { PacienteRepository } from '../../domain/repositories/paciente.repository';
import { PessoaRepository } from '../../domain/repositories/pessoa.repository';
import { CriarPacienteDto } from '../../domain/dtos/paciente/criar-paciente.dto';
import { CriarPacienteCompletoDto } from '../../domain/dtos/paciente/criar-paciente-completo.dto';
import { CriarPaciente } from '../../domain/use-cases/paciente/criar-paciente.use-case';
import { CriarPacienteCompleto } from '../../domain/use-cases/paciente/criar-paciente-completo.use-case';
import { BuscarPacienteDto } from '../../domain/dtos/paciente/buscar-paciente.dto';
import { BuscarPaciente } from '../../domain/use-cases/paciente/buscar-paciente.use-case';
import { AtualizarPacienteDto } from '../../domain/dtos/paciente/atualizar-paciente.dto';
import { AtualizarPaciente } from '../../domain/use-cases/paciente/atualizar-paciente.use-case';
import { CustomError } from '../../domain';

export class PacienteController {
    constructor(
        private readonly pacienteRepository: PacienteRepository,
        private readonly pessoaRepository: PessoaRepository
    ) {}

    criarPaciente = (req: Request, res: Response) => {
        const [error, criarPacienteDto] = CriarPacienteDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new CriarPaciente(this.pacienteRepository, this.pessoaRepository)
            .execute(criarPacienteDto!, tenantId, userId)
            .then(paciente => res.status(201).json(paciente))
            .catch(error => this.handleError(error, res));
    };

    criarPacienteCompleto = (req: Request, res: Response) => {
        const [error, criarPacienteCompletoDto] = CriarPacienteCompletoDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new CriarPacienteCompleto(this.pacienteRepository, this.pessoaRepository)
            .execute(criarPacienteCompletoDto!, tenantId, userId)
            .then(paciente => res.status(201).json(paciente))
            .catch(error => this.handleError(error, res));
    };

    buscarPacientes = (req: Request, res: Response) => {
        const [error, buscarPacienteDto] = BuscarPacienteDto.create(req.query);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;

        new BuscarPaciente(this.pacienteRepository)
            .execute(buscarPacienteDto!, tenantId)
            .then(resultado => res.json(resultado))
            .catch(error => this.handleError(error, res));
    };

    buscarPacientePorId = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.pacienteRepository.buscarPorId(id, tenantId)
            .then(paciente => {
                if (!paciente) {
                    return res.status(404).json({ error: 'Paciente não encontrado' });
                }
                res.json(paciente);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarPacientePorCpf = (req: Request, res: Response) => {
        const { cpf } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        // Primeiro buscar a pessoa pelo CPF, depois o paciente
        this.pessoaRepository.buscarPorCpf(cpf, tenantId)
            .then(pessoa => {
                if (!pessoa) {
                    return res.status(404).json({ error: 'Pessoa não encontrada' });
                }
                
                return this.pacienteRepository.buscarPorPessoa(pessoa.id, tenantId);
            })
            .then(paciente => {
                if (!paciente) {
                    return res.status(404).json({ error: 'Paciente não encontrado' });
                }
                res.json(paciente);
            })
            .catch(error => this.handleError(error, res));
    };

    buscarPacientePorCartaoSus = (req: Request, res: Response) => {
        const { cartao } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.pacienteRepository.buscarPorCartaoSus(cartao, tenantId)
            .then(paciente => {
                if (!paciente) {
                    return res.status(404).json({ error: 'Paciente não encontrado' });
                }
                res.json(paciente);
            })
            .catch(error => this.handleError(error, res));
    };

    atualizarPaciente = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, atualizarPacienteDto] = AtualizarPacienteDto.create(req.body);
        
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const tenantId = req.body.tenant?.id || req.body.tenantId;
        const userId = req.body.user?.id || req.body.userId;

        new AtualizarPaciente(this.pacienteRepository)
            .execute(id, atualizarPacienteDto!, tenantId, userId)
            .then(paciente => res.json(paciente))
            .catch(error => this.handleError(error, res));
    };

    deletarPaciente = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.pacienteRepository.deletar(id, tenantId)
            .then(deletado => {
                if (!deletado) {
                    return res.status(404).json({ error: 'Paciente não encontrado' });
                }
                res.json({ message: 'Paciente deletado com sucesso' });
            })
            .catch(error => this.handleError(error, res));
    };

    obterHistoricoMedico = (req: Request, res: Response) => {
        const { id } = req.params;
        const tenantId = req.body.tenant?.id || req.body.tenantId;

        this.pacienteRepository.buscarPorId(id, tenantId)
            .then(paciente => {
                if (!paciente) {
                    return res.status(404).json({ error: 'Paciente não encontrado' });
                }
                
                res.json({
                    paciente_id: paciente.id,
                    nome: paciente.pessoa?.nome,
                    historico_medico: paciente.historico_medico,
                    alergias: paciente.alergias,
                    medicamentos_uso_continuo: paciente.medicamentos_uso_continuo,
                    tipo_sanguineo: paciente.tipo_sanguineo,
                    contato_emergencia: paciente.contato_emergencia
                });
            })
            .catch(error => this.handleError(error, res));
    };

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error('Erro paciente controller:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    };
}
