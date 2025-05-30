// infrastructure/repositories/medicamento.repository.impl.ts
import { BuscarMedicamentoResult, MedicamentoDatasource } from "../../domain/datasources/medicamento.datasource";
import { AtualizarMedicamentoDto } from "../../domain/dtos/medicamento/atualizar-medicamento.dto";
import { BuscarMedicamentoDto } from "../../domain/dtos/medicamento/buscar-medicamento.dto";
import { CriarMedicamentoDto } from "../../domain/dtos/medicamento/criar-medicamento.dto";
import { MedicamentoEntity } from "../../domain/entities/medicamento.entity";
import { MedicamentoRepository } from "../../domain/repositories/medicamento.repository";

export class MedicamentoRepositoryImpl implements MedicamentoRepository {
    constructor(private readonly medicamentoDatasource: MedicamentoDatasource) {}

    criar(criarMedicamentoDto: CriarMedicamentoDto, tenantId: string, userId: string): Promise<MedicamentoEntity> {
        return this.medicamentoDatasource.criar(criarMedicamentoDto, tenantId, userId);
    }

    buscarPorId(id: string, tenantId: string): Promise<MedicamentoEntity | null> {
        return this.medicamentoDatasource.buscarPorId(id, tenantId);
    }

    buscarPorCodigoEan(codigoEan: string, tenantId: string): Promise<MedicamentoEntity | null> {
        return this.medicamentoDatasource.buscarPorCodigoEan(codigoEan, tenantId);
    }

    buscar(buscarMedicamentoDto: BuscarMedicamentoDto, tenantId: string): Promise<BuscarMedicamentoResult> {
        return this.medicamentoDatasource.buscar(buscarMedicamentoDto, tenantId);
    }

    buscarControlados(tenantId: string): Promise<MedicamentoEntity[]> {
        return this.medicamentoDatasource.buscarControlados(tenantId);
    }

    buscarDisponivelSus(tenantId: string): Promise<MedicamentoEntity[]> {
        return this.medicamentoDatasource.buscarDisponivelSus(tenantId);
    }

    buscarAtivos(tenantId: string): Promise<MedicamentoEntity[]> {
        return this.medicamentoDatasource.buscarAtivos(tenantId);
    }

    atualizar(id: string, atualizarMedicamentoDto: AtualizarMedicamentoDto, tenantId: string, userId: string): Promise<MedicamentoEntity> {
        return this.medicamentoDatasource.atualizar(id, atualizarMedicamentoDto, tenantId, userId);
    }

    ativar(id: string, tenantId: string, userId: string): Promise<boolean> {
        return this.medicamentoDatasource.ativar(id, tenantId, userId);
    }

    desativar(id: string, tenantId: string, userId: string): Promise<boolean> {
        return this.medicamentoDatasource.desativar(id, tenantId, userId);
    }

    deletar(id: string, tenantId: string): Promise<boolean> {
        return this.medicamentoDatasource.deletar(id, tenantId);
    }
}