// infrastructure/repositories/medico.repository.impl.ts
import { BuscarMedicoResult, AgendaHorario, MedicoDatasource } from "../../domain/datasources/medico.datasource";
import { AtualizarMedicoDto } from "../../domain/dtos/medico/atualizar-medico.dto";
import { BuscarMedicoDto } from "../../domain/dtos/medico/buscar-medico.dto";
import { CriarMedicoCompletoDto } from "../../domain/dtos/medico/criar-medico-completo.dto";
import { CriarMedicoDto } from "../../domain/dtos/medico/criar-medico.dto";
import { MedicoEntity } from "../../domain/entities/medico.entity";
import { MedicoRepository } from "../../domain/repositories/medico.repository";

export class MedicoRepositoryImpl implements MedicoRepository {
    constructor(private readonly medicoDatasource: MedicoDatasource) {}

    criar(criarMedicoDto: CriarMedicoDto, tenantId: string, userId: string): Promise<MedicoEntity> {
        return this.medicoDatasource.criar(criarMedicoDto, tenantId, userId);
    }

    criarCompleto(criarMedicoCompletoDto: CriarMedicoCompletoDto, tenantId: string, userId: string): Promise<MedicoEntity> {
        return this.medicoDatasource.criarCompleto(criarMedicoCompletoDto, tenantId, userId);
    }

    buscarPorId(id: string, tenantId: string): Promise<MedicoEntity | null> {
        return this.medicoDatasource.buscarPorId(id, tenantId);
    }

    buscarPorPessoa(pessoaId: string, tenantId: string): Promise<MedicoEntity | null> {
        return this.medicoDatasource.buscarPorPessoa(pessoaId, tenantId);
    }

    buscarPorCrm(crm: string, tenantId: string): Promise<MedicoEntity | null> {
        return this.medicoDatasource.buscarPorCrm(crm, tenantId);
    }

    buscar(buscarMedicoDto: BuscarMedicoDto, tenantId: string): Promise<BuscarMedicoResult> {
        return this.medicoDatasource.buscar(buscarMedicoDto, tenantId);
    }

    buscarPorUnidade(unidadeId: string, tenantId: string): Promise<MedicoEntity[]> {
        return this.medicoDatasource.buscarPorUnidade(unidadeId, tenantId);
    }

    buscarPorEspecialidade(especialidade: string, tenantId: string): Promise<MedicoEntity[]> {
        return this.medicoDatasource.buscarPorEspecialidade(especialidade, tenantId);
    }

    obterAgenda(medicoId: string, data: Date, tenantId: string): Promise<AgendaHorario[]> {
        return this.medicoDatasource.obterAgenda(medicoId, data, tenantId);
    }

    atualizar(id: string, atualizarMedicoDto: AtualizarMedicoDto, tenantId: string, userId: string): Promise<MedicoEntity> {
        return this.medicoDatasource.atualizar(id, atualizarMedicoDto, tenantId, userId);
    }

    deletar(id: string, tenantId: string): Promise<boolean> {
        return this.medicoDatasource.deletar(id, tenantId);
    }
}