// ===================================
// config/validators.ts (ATUALIZADO - Adicionando validadores faltantes)
// ===================================
export class Validators {
    static get email() {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    }

    static get cpf() {
        return /^\d{11}$/;
    }

    static get mongoId() {
        return /^[0-9a-fA-F]{24}$/;
    }

    static get url() {
        return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    }

    static get hora() {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    }

    static get telefone() {
        return /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    }

    static get cep() {
        return /^\d{5}-?\d{3}$/;
    }

    static get cnpj() {
        return /^\d{14}$/;
    }

    static tipoSanguineo(tipo: string): boolean {
        return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(tipo);
    }

    static cartaoSus(cartao: string): boolean {
        const limpo = cartao.replace(/\D/g, '');
        return limpo.length === 15;
    }

    static validarCPF(cpf: string): boolean {
        const cpfLimpo = cpf.replace(/\D/g, '');
        
        if (cpfLimpo.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpfLimpo)) return false; // Sequência de números iguais
        
        // Validação dos dígitos verificadores
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digito1 = resto < 2 ? 0 : resto;
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digito2 = resto < 2 ? 0 : resto;
        
        return digito1 === parseInt(cpfLimpo.charAt(9)) && 
               digito2 === parseInt(cpfLimpo.charAt(10));
    }

    static validarCNPJ(cnpj: string): boolean {
        const cnpjLimpo = cnpj.replace(/\D/g, '');
        
        if (cnpjLimpo.length !== 14) return false;
        if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;
        
        // Validação simplificada dos dígitos verificadores
        let soma = 0;
        let peso = 2;
        
        for (let i = 11; i >= 0; i--) {
            soma += parseInt(cnpjLimpo.charAt(i)) * peso;
            peso = peso === 9 ? 2 : peso + 1;
        }
        
        let digito1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        
        soma = 0;
        peso = 2;
        
        for (let i = 12; i >= 0; i--) {
            soma += parseInt(cnpjLimpo.charAt(i)) * peso;
            peso = peso === 9 ? 2 : peso + 1;
        }
        
        let digito2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        
        return digito1 === parseInt(cnpjLimpo.charAt(12)) && 
               digito2 === parseInt(cnpjLimpo.charAt(13));
    }
}