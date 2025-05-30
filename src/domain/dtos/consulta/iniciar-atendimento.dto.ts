// domain/dtos/consulta/iniciar-atendimento.dto.ts
export class IniciarAtendimentoDto {
    private constructor(
        public sintomas?: string,
        public sinais_vitais?: {
            pressao_arterial?: string;
            temperatura?: number;
            frequencia_cardiaca?: number;
            frequencia_respiratoria?: number;
            saturacao_oxigenio?: number;
            peso?: number;
            altura?: number;
        },
        public triagem?: {
            prioridade: 'VERDE' | 'AMARELA' | 'LARANJA' | 'VERMELHA' | 'AZUL';
            classificacao_manchester?: string;
            tempo_espera_max?: number;
        },
        public observacoes_iniciais?: string
    ) {}

    static create(object: { [key: string]: any }): [string?, IniciarAtendimentoDto?] {
        const { sintomas, sinais_vitais, triagem, observacoes_iniciais } = object;

        if (sinais_vitais) {
            const { temperatura, frequencia_cardiaca, frequencia_respiratoria, saturacao_oxigenio, peso, altura } = sinais_vitais;
            
            if (temperatura !== undefined && (temperatura < 30 || temperatura > 45)) {
                return ['Temperatura deve estar entre 30°C e 45°C'];
            }
            
            if (frequencia_cardiaca !== undefined && (frequencia_cardiaca < 30 || frequencia_cardiaca > 250)) {
                return ['Frequência cardíaca deve estar entre 30 e 250 bpm'];
            }
            
            if (saturacao_oxigenio !== undefined && (saturacao_oxigenio < 0 || saturacao_oxigenio > 100)) {
                return ['Saturação de oxigênio deve estar entre 0% e 100%'];
            }
            
            if (peso !== undefined && (peso < 0.5 || peso > 500)) {
                return ['Peso deve estar entre 0.5kg e 500kg'];
            }
            
            if (altura !== undefined && (altura < 30 || altura > 250)) {
                return ['Altura deve estar entre 30cm e 250cm'];
            }
        }

        if (triagem) {
            const prioridadesValidas = ['VERDE', 'AMARELA', 'LARANJA', 'VERMELHA', 'AZUL'];
            if (!prioridadesValidas.includes(triagem.prioridade)) {
                return ['Prioridade de triagem inválida'];
            }
        }

        return [undefined, new IniciarAtendimentoDto(
            sintomas?.trim(),
            sinais_vitais,
            triagem,
            observacoes_iniciais?.trim()
        )];
    }
}