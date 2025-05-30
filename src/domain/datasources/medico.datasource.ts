import { AtualizarMedicoDto } from "../dtos/medico/atualizar-medico.dto";
import { BuscarMedicoDto } from "../dtos/medico/buscar-medico.dto";
import { CriarMedicoCompletoDto } from "../dtos/medico/criar-medico-completo.dto";
import { CriarMedicoDto } from "../dtos/medico/criar-medico.dto";
import { MedicoEntity } from "../entities/medico.entity";

// domain/datasources/medico.datasource.ts
export interface BuscarMedicoResult {
    data: MedicoEntity[];
    total: number;
    page: number;
    totalPages: number;
}

export interface AgendaHorario {
    dia_semana: number;
    hora_inicio: string;
    hora_fim: string;
    disponivel: boolean;
    consultas_agendadas: number;
}

export abstract class MedicoDatasource {
    abstract criar(criarMedicoDto: CriarMedicoDto, tenantId: string, userId: string): Promise<MedicoEntity>;
    abstract criarCompleto(criarMedicoCompletoDto: CriarMedicoCompletoDto, tenantId: string, userId: string): Promise<MedicoEntity>;
    abstract buscarPorId(id: string, tenantId: string): Promise<MedicoEntity | null>;
    abstract buscarPorPessoa(pessoaId: string, tenantId: string): Promise<MedicoEntity | null>;
    abstract buscarPorCrm(crm: string, tenantId: string): Promise<MedicoEntity | null>;
    abstract buscar(buscarMedicoDto: BuscarMedicoDto, tenantId: string): Promise<BuscarMedicoResult>;
    abstract buscarPorUnidade(unidadeId: string, tenantId: string): Promise<MedicoEntity[]>;
    abstract buscarPorEspecialidade(especialidade: string, tenantId: string): Promise<MedicoEntity[]>;
    abstract obterAgenda(medicoId: string, data: Date, tenantId: string): Promise<AgendaHorario[]>;
    abstract atualizar(id: string, atualizarMedicoDto: AtualizarMedicoDto, tenantId: string, userId: string): Promise<MedicoEntity>;
    abstract deletar(id: string, tenantId: string): Promise<boolean>;
}