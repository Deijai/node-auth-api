import mongoose, { Schema } from "mongoose";
import { baseSchemaFields } from "./base.model";

// ================================
// UNIDADE DE SAÚDE
// ================================
const unidadeSchema = new Schema({
  ...baseSchemaFields,
  nome: {
    type: String,
    required: true,
    maxlength: 255
  },
  tipo: {
    type: String,
    enum: ['UPA', 'UBS', 'HOSPITAL', 'CLINICA', 'LABORATORIO', 'FARMACIA', 'SECRETARIA'],
    required: true
  },
  cnes: {
    type: String,
    maxlength: 20,
    unique: true,
    sparse: true
  },
  endereco: {
    logradouro: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    cep: String,
    coordenadas: {
      latitude: Number,
      longitude: Number
    }
  },
  contato: {
    telefone: String,
    email: String,
    site: String
  },
  horario_funcionamento: [{
    dia_semana: {
      type: Number,
      min: 0,
      max: 6
    },
    hora_abertura: String,
    hora_fechamento: String,
    funciona_24h: {
      type: Boolean,
      default: false
    }
  }],
  especialidades: [{
    nome: String,
    ativa: {
      type: Boolean,
      default: true
    }
  }],
  capacidade: {
    leitos_total: Number,
    leitos_uti: Number,
    consultórios: Number,
    salas_cirurgia: Number
  },
  equipamentos: [{
    nome: String,
    modelo: String,
    quantidade: Number,
    status: {
      type: String,
      enum: ['FUNCIONANDO', 'MANUTENCAO', 'INATIVO']
    }
  }],
  gestor_responsavel: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }
});


export const UnidadeModel = mongoose.model('Unidade', unidadeSchema);