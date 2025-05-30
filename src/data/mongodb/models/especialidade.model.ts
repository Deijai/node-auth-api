// ===================================
// data/mongodb/models/especialidade.model.ts
// ===================================
import mongoose, { Schema } from "mongoose";
import { baseSchemaFields } from "./base.model";

const especialidadeSchema = new Schema({
  ...baseSchemaFields,
  nome: {
    type: String,
    required: true,
    maxlength: 255,
    unique: true
  },
  codigo: {
    type: String,
    required: true,
    maxlength: 10,
    unique: true
  },
  descricao: {
    type: String,
    maxlength: 1000
  },
  area_medica: {
    type: String,
    enum: ['CLINICA_MEDICA', 'CIRURGIA', 'PEDIATRIA', 'GINECOLOGIA', 'PSIQUIATRIA', 'RADIOLOGIA', 'PATOLOGIA', 'OUTROS'],
    default: 'OUTROS'
  },
  ativa: {
    type: Boolean,
    default: true
  },
  requer_residencia: {
    type: Boolean,
    default: false
  },
  tempo_consulta_padrao: {
    type: Number,
    default: 30 // minutos
  }
});

export const EspecialidadeModel = mongoose.model('Especialidade', especialidadeSchema);