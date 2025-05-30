import mongoose, { Schema } from "mongoose";

// ================================
// TENANT (CIDADE/MUNICÍPIO)
// ================================
const tenantSchema = new Schema({
  nome: {
    type: String,
    required: true,
    maxlength: 255
  },
  codigo: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  subdomain: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100
  },
  cnpj: {
    type: String,
    maxlength: 18
  },
  endereco: {
    logradouro: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    cep: String
  },
  contato: {
    telefone: String,
    email: String,
    site: String
  },
  configuracoes: {
    timezone: {
      type: String,
      default: 'America/Sao_Paulo'
    },
    logo_url: String,
    cores_tema: {
      primaria: String,
      secundaria: String,
      acento: String
    },
    modulos_ativos: [{
      type: String,
      enum: ['UPA', 'UBS', 'SECRETARIA', 'LABORATORIO', 'FARMACIA']
    }]
  },
  status: {
    type: String,
    enum: ['ATIVO', 'INATIVO', 'SUSPENSO'],
    default: 'ATIVO'
  },
  data_criacao: {
    type: Date,
    default: Date.now
  }
});

export const TenantModel = mongoose.model('Tenant', tenantSchema);