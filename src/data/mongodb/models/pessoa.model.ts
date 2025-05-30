import mongoose, { Schema } from "mongoose";
import { baseSchemaFields } from "./base.model";
// ================================
// PESSOA (Tabela base para herança)
// ================================
const pessoaSchema = new Schema({
  ...baseSchemaFields,
  nome: {
    type: String,
    required: true,
    maxlength: 255
  },
  data_nascimento: {
    type: Date,
    required: true
  },
  sexo: {
    type: String,
    enum: ['M', 'F', 'O'],
    required: true
  },
  cpf: {
    type: String,
    required: true,
    maxlength: 14,
    unique: true
  },
  telefone: {
    type: String,
    maxlength: 20
  },
  email: {
    type: String,
    maxlength: 255,
    lowercase: true
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
  status: {
    type: String,
    enum: ['ATIVO', 'INATIVO'],
    default: 'ATIVO'
  }
});

export const PessoaModel = mongoose.model('Pessoa', pessoaSchema);