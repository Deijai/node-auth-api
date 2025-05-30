import mongoose, { Schema } from "mongoose";
import { baseSchemaFields } from "./base.model";

// ================================
// USUÁRIO (Sistema)
// ================================
const usuarioSchema = new Schema({
    ...baseSchemaFields,
    pessoa_id: {
        type: Schema.Types.ObjectId,
        ref: 'Pessoa'
    },
    usuario: {
        type: String,
        required: true,
        maxlength: 100,
        unique: true
    },
    senha: {
        type: String,
        required: true,
        maxlength: 255
    },
    papel: {
        type: String,
        enum: ['ADMIN', 'MEDICO', 'ENFERMEIRO', 'RECEPCIONISTA', 'FARMACEUTICO', 'LABORATORISTA', 'GESTOR'],
        required: true
    },
    ativo: {
        type: Boolean,
        default: true
    },
    unidades_acesso: [{
        type: Schema.Types.ObjectId,
        ref: 'Unidade'
    }],
    permissoes: [{
        type: String,
        enum: [
            'CADASTRAR_PACIENTE',
            'EDITAR_PACIENTE',
            'VISUALIZAR_PACIENTE',
            'AGENDAR_CONSULTA',
            'CANCELAR_CONSULTA',
            'REALIZAR_ATENDIMENTO',
            'PRESCREVER_MEDICAMENTO',
            'SOLICITAR_EXAME',
            'GERAR_RELATORIOS',
            'GERENCIAR_USUARIOS',
            'CONFIGURAR_SISTEMA'
        ]
    }],
    ultimo_acesso: Date,
    tentativas_login: {
        type: Number,
        default: 0
    },
    bloqueado_ate: Date
});

export const UsuarioModel = mongoose.model('Usuario', usuarioSchema);