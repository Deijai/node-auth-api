// domain/datasources/paciente.datasource.ts

import { AtualizarPacienteDto } from "../dtos/paciente/atualizar-paciente.dto";
import { BuscarPacienteDto } from "../dtos/paciente/buscar-paciente.dto";
import { CriarPacienteCompletoDto } from "../dtos/paciente/criar-paciente-completo.dto";
import { CriarPacienteDto } from "../dtos/paciente/criar-paciente.dto";
import { PacienteEntity } from "../entities/paciente.entity";

export interface BuscarPacienteResult {
    data: PacienteEntity[];
    total: number;
    page: number;
    totalPages: number;
}

export abstract class PacienteDatasource {
    abstract criar(criarPacienteDto: CriarPacienteDto, tenantId: string, userId: string): Promise<PacienteEntity>;
    abstract criarCompleto(criarPacienteCompletoDto: CriarPacienteCompletoDto, tenantId: string, userId: string): Promise<PacienteEntity>;
    abstract buscarPorId(id: string, tenantId: string): Promise<PacienteEntity | null>;
    abstract buscarPorPessoa(pessoaId: string, tenantId: string): Promise<PacienteEntity | null>;
    abstract buscarPorCartaoSus(cartaoSus: string, tenantId: string): Promise<PacienteEntity | null>;
    abstract buscar(buscarPacienteDto: BuscarPacienteDto, tenantId: string): Promise<BuscarPacienteResult>;
    abstract atualizar(id: string, atualizarPacienteDto: AtualizarPacienteDto, tenantId: string, userId: string): Promise<PacienteEntity>;
    abstract deletar(id: string, tenantId: string): Promise<boolean>;
}