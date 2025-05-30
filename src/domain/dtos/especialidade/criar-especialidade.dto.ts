// ===================================
// domain/dtos/especialidade/criar-especialidade.dto.ts
// ===================================
export class CriarEspecialidadeDto {
    private constructor(
        public nome: string,
        public codigo: string,
        public descricao?: string,
        public area_medica?: 'CLINICA_MEDICA' | 'CIRURGIA' | 'PEDIATRIA' | 'GINECOLOGIA' | 'PSIQUIATRIA' | 'RADIOLOGIA' | 'PATOLOGIA' | 'OUTROS',
        public requer_residencia?: boolean,
        public tempo_consulta_padrao?: number
    ) {}

    static create(object: { [key: string]: any }): [string?, CriarEspecialidadeDto?] {
        const { nome, codigo, descricao, area_medica, requer_residencia, tempo_consulta_padrao } = object;

        if (!nome) return ['Nome da especialidade é obrigatório'];
        if (nome.length < 2) return ['Nome deve ter pelo menos 2 caracteres'];
        if (nome.length > 255) return ['Nome não pode exceder 255 caracteres'];

        if (!codigo) return ['Código da especialidade é obrigatório'];
        if (codigo.length > 10) return ['Código não pode exceder 10 caracteres'];
        if (!/^[A-Z0-9_-]+$/.test(codigo)) {
            return ['Código pode conter apenas letras maiúsculas, números, hífen e underscore'];
        }

        if (descricao && descricao.length > 1000) {
            return ['Descrição não pode exceder 1000 caracteres'];
        }

        if (area_medica) {
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

        return [undefined, new CriarEspecialidadeDto(
            nome.trim(),
            codigo.toUpperCase().trim(),
            descricao?.trim(),
            area_medica || 'OUTROS',
            requer_residencia || false,
            tempo_consulta_padrao || 30
        )];
    }
}