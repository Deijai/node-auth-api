// ===================================
// domain/entities/especialidade.entity.ts
// ===================================
export class EspecialidadeEntity {
    constructor(
        public id: string,
        public tenant_id: string,
        public nome: string,
        public codigo: string,
        public descricao?: string,
        public area_medica: 'CLINICA_MEDICA' | 'CIRURGIA' | 'PEDIATRIA' | 'GINECOLOGIA' | 'PSIQUIATRIA' | 'RADIOLOGIA' | 'PATOLOGIA' | 'OUTROS' = 'OUTROS',
        public ativa: boolean = true,
        public requer_residencia: boolean = false,
        public tempo_consulta_padrao: number = 30,
        public created_at?: Date,
        public updated_at?: Date,
        public created_by?: string,
        public updated_by?: string
    ) {}
}