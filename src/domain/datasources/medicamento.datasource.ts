// domain/datasources/medicamento.datasource.ts
import { AtualizarMedicamentoDto } from "../dtos/medicamento/atualizar-medicamento.dto";
import { BuscarMedicamentoDto } from "../dtos/medicamento/buscar-medicamento.dto";
import { CriarMedicamentoDto } from "../dtos/medicamento/criar-medicamento.dto";
import { MedicamentoEntity } from "../entities/medicamento.entity";

export interface BuscarMedicamentoResult {
    data: MedicamentoEntity[];
    total: number;
    page: number;
    totalPages: number;
}

export abstract class MedicamentoDatasource {
    abstract criar(criarMedicamentoDto: CriarMedicamentoDto, tenantId: string, userId: string): Promise<MedicamentoEntity>;
    abstract buscarPorId(id: string, tenantId: string): Promise<MedicamentoEntity | null>;
    abstract buscarPorCodigoEan(codigoEan: string, tenantId: string): Promise<MedicamentoEntity | null>;
    abstract buscar(buscarMedicamentoDto: BuscarMedicamentoDto, tenantId: string): Promise<BuscarMedicamentoResult>;
    abstract buscarControlados(tenantId: string): Promise<MedicamentoEntity[]>;
    abstract buscarDisponivelSus(tenantId: string): Promise<MedicamentoEntity[]>;
    abstract buscarAtivos(tenantId: string): Promise<MedicamentoEntity[]>;
    abstract atualizar(id: string, atualizarMedicamentoDto: AtualizarMedicamentoDto, tenantId: string, userId: string): Promise<MedicamentoEntity>;
    abstract ativar(id: string, tenantId: string, userId: string): Promise<boolean>;
    abstract desativar(id: string, tenantId: string, userId: string): Promise<boolean>;
    abstract deletar(id: string, tenantId: string): Promise<boolean>;
}