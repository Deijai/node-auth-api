// domain/dtos/especialidade/atualizar-especialidade.dto.ts
export class AtualizarEspecialidadeDto {
    private constructor(
        public nome?: string,
        public descricao?: string,
        public area_medica?: 'CLINICA_MEDICA' | 'CIRURGIA' | 'PEDIATRIA' | 'GINECOLOGIA' | 'PSIQUIATRIA' | 'RADIOLOGIA' | 'PATOLOGIA' | 'OUTROS',
        public ativa?: boolean,
        public requer_residencia?: boolean,
        public tempo_consulta_padrao?: number
    ) {}

    static create(object: { [key: string]: any }): [string?, AtualizarEspecialidadeDto?] {
        const { nome, descricao, area_medica, ativa, requer_residencia, tempo_consulta_padrao } = object;

        if (nome !== undefined) {
            if (nome.length < 2) return ['Nome deve ter pelo menos 2 caracteres'];
            if (nome.length > 255) return ['Nome não pode exceder 255 caracteres'];
        }

        if (descricao !== undefined && descricao.length > 1000) {
            return ['Descrição não pode exceder 1000 caracteres'];
        }

        if (area_medica !== undefined) {
            const areasValidas = ['CLINICA_MEDICA', 'CIRURGIA', 'PEDIATRIA', 'GINECOLOGIA', 'PSIQUIATRIA', 'RADIOLOGIA', 'PATOLOGIA', 'OUTROS'];
            if (!areasValidas.includes(area_medica)) {
                return ['Área médica inválida'];
            }
        }

        if (tempo_consulta_padrao !== undefined) {
            if (tempo_consulta_padrao < 5 || tempo_consulta_padrao > 480) {
                return ['Tempo de consulta deve estar entre 5 e 480 minutos'];
            }
        }

        return [undefined, new AtualizarEspecialidadeDto(
            nome?.trim(),
            descricao?.trim(),
            area_medica,
            ativa,
            requer_residencia,
            tempo_consulta_padrao
        )];
    }
}
