// domain/dtos/paciente/buscar-paciente.dto.ts
export class BuscarPacienteDto {
    private constructor(
        public page: number = 1,
        public limit: number = 20,
        public search?: string,
        public tipo_sanguineo?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
        public tem_alergias?: boolean,
        public cidade?: string,
        public estado?: string
    ) {}

    static create(object: { [key: string]: any }): [string?, BuscarPacienteDto?] {
        const { page, limit, search, tipo_sanguineo, tem_alergias, cidade, estado } = object;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;

        if (pageNum < 1) return ['Página deve ser maior que 0'];
        if (limitNum < 1 || limitNum > 100) return ['Limit deve estar entre 1 e 100'];

        if (tipo_sanguineo && !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(tipo_sanguineo)) {
            return ['Tipo sanguíneo inválido'];
        }

        return [undefined, new BuscarPacienteDto(
            pageNum,
            limitNum,
            search?.trim(),
            tipo_sanguineo,
            tem_alergias === 'true' || tem_alergias === true,
            cidade?.trim(),
            estado?.trim()
        )];
    }
}