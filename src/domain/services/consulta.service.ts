// services/consulta.service.ts
export class ConsultaService {
    
    static calcularIdadeNaConsulta(dataNascimento: Date, dataConsulta: Date): number {
        let idade = dataConsulta.getFullYear() - dataNascimento.getFullYear();
        const mesAtual = dataConsulta.getMonth();
        const diaAtual = dataConsulta.getDate();
        
        if (mesAtual < dataNascimento.getMonth() || 
            (mesAtual === dataNascimento.getMonth() && diaAtual < dataNascimento.getDate())) {
            idade--;
        }
        
        return idade;
    }
    
    static calcularIMC(peso: number, altura: number): number {
        const alturaMetros = altura / 100;
        return parseFloat((peso / (alturaMetros * alturaMetros)).toFixed(2));
    }
    
    static classificarIMC(imc: number): string {
        if (imc < 18.5) return 'Abaixo do peso';
        if (imc < 25) return 'Peso normal';
        if (imc < 30) return 'Sobrepeso';
        if (imc < 35) return 'Obesidade grau I';
        if (imc < 40) return 'Obesidade grau II';
        return 'Obesidade grau III';
    }
    
    static classificarPressaoArterial(pressao: string): string {
        const [sistolica, diastolica] = pressao.split('/').map(Number);
        
        if (sistolica < 120 && diastolica < 80) return 'Normal';
        if (sistolica < 130 && diastolica < 80) return 'Elevada';
        if (sistolica < 140 || diastolica < 90) return 'Hipertensão estágio 1';
        if (sistolica < 180 || diastolica < 120) return 'Hipertensão estágio 2';
        return 'Crise hipertensiva';
    }
    
    static gerarNumeroConsulta(tenantId: string, dataConsulta: Date): string {
        const ano = dataConsulta.getFullYear();
        const mes = (dataConsulta.getMonth() + 1).toString().padStart(2, '0');
        const dia = dataConsulta.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        
        return `${tenantId.slice(-4)}-${ano}${mes}${dia}-${random}`;
    }
}