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

    static tipoSanguineo(tipo: string): boolean {
        return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(tipo);
    }

    static cartaoSus(cartao: string): boolean {
        const limpo = cartao.replace(/\D/g, '');
        return limpo.length === 15;
    }    

}