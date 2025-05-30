// infrastructure/repositories/paciente.repository.impl.ts
import { BuscarPacienteResult, PacienteDatasource } from "../../domain/datasources/paciente.datasource";
import { AtualizarPacienteDto } from "../../domain/dtos/paciente/atualizar-paciente.dto";
import { BuscarPacienteDto } from "../../domain/dtos/paciente/buscar-paciente.dto";
import { CriarPacienteCompletoDto } from "../../domain/dtos/paciente/criar-paciente-completo.dto";
import { CriarPacienteDto } from "../../domain/dtos/paciente/criar-paciente.dto";
import { PacienteEntity } from "../../domain/entities/paciente.entity";
import { PacienteRepository } from "../../domain/repositories/paciente.repository";

export class PacienteRepositoryImpl implements PacienteRepository {
    constructor(private readonly pacienteDatasource: PacienteDatasource) {}

    criar(criarPacienteDto: CriarPacienteDto, tenantId: string, userId: string): Promise<PacienteEntity> {
        return this.pacienteDatasource.criar(criarPacienteDto, tenantId, userId);
    }

    criarCompleto(criarPacienteCompletoDto: CriarPacienteCompletoDto, tenantId: string, userId: string): Promise<PacienteEntity> {
        return this.pacienteDatasource.criarCompleto(criarPacienteCompletoDto, tenantId, userId);
    }

    buscarPorId(id: string, tenantId: string): Promise<PacienteEntity | null> {
        return this.pacienteDatasource.buscarPorId(id, tenantId);
    }

    buscarPorPessoa(pessoaId: string, tenantId: string): Promise<PacienteEntity | null> {
        return this.pacienteDatasource.buscarPorPessoa(pessoaId, tenantId);
    }

    buscarPorCartaoSus(cartaoSus: string, tenantId: string): Promise<PacienteEntity | null> {
        return this.pacienteDatasource.buscarPorCartaoSus(cartaoSus, tenantId);
    }

    buscar(buscarPacienteDto: BuscarPacienteDto, tenantId: string): Promise<BuscarPacienteResult> {
        return this.pacienteDatasource.buscar(buscarPacienteDto, tenantId);
    }

    atualizar(id: string, atualizarPacienteDto: AtualizarPacienteDto, tenantId: string, userId: string): Promise<PacienteEntity> {
        return this.pacienteDatasource.atualizar(id, atualizarPacienteDto, tenantId, userId);
    }

    deletar(id: string, tenantId: string): Promise<boolean> {
        return this.pacienteDatasource.deletar(id, tenantId);
    }
}