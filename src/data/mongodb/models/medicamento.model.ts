// ===================================
// data/mongodb/models/medicamento.model.ts
// ===================================
import mongoose, { Schema } from "mongoose";
import { baseSchemaFields } from "./base.model";

const medicamentoSchema = new Schema({
  ...baseSchemaFields,
  nome_comercial: {
    type: String,
    required: true,
    maxlength: 255
  },
  nome_generico: {
    type: String,
    required: true,
    maxlength: 255
  },
  principio_ativo: {
    type: String,
    required: true,
    maxlength: 255
  },
  codigo_ean: {
    type: String,
    maxlength: 20,
    unique: true,
    sparse: true
  },
  registro_anvisa: {
    type: String,
    maxlength: 50
  },
  fabricante: {
    type: String,
    maxlength: 255
  },
  forma_farmaceutica: {
    type: String,
    enum: ['COMPRIMIDO', 'CAPSULA', 'XAROPE', 'INJECAO', 'POMADA', 'CREME', 'GOTAS', 'SPRAY', 'OUTROS'],
    required: true
  },
  concentracao: {
    type: String,
    maxlength: 100
  },
  via_administracao: {
    type: String,
    enum: ['ORAL', 'TOPICA', 'INTRAVENOSA', 'INTRAMUSCULAR', 'SUBCUTANEA', 'INALATORIA', 'OFTALMOLOGICA', 'OUTROS'],
    required: true
  },
  classe_terapeutica: {
    type: String,
    maxlength: 255
  },
  controlado: {
    type: Boolean,
    default: false
  },
  tipo_receita: {
    type: String,
    enum: ['COMUM', 'ESPECIAL', 'CONTROLE_ESPECIAL', 'A1', 'A2', 'A3', 'B1', 'B2', 'C1', 'C2'],
    default: 'COMUM'
  },
  disponivel_sus: {
    type: Boolean,
    default: false
  },
  preco_referencia: {
    type: Number,
    min: 0
  },
  estoque_minimo: {
    type: Number,
    default: 0
  },
  ativo: {
    type: Boolean,
    default: true
  },
  observacoes: {
    type: String,
    maxlength: 1000
  }
});

export const MedicamentoModel = mongoose.model('Medicamento', medicamentoSchema);