import mongoose, { Schema } from "mongoose";
import { baseSchemaFields } from "./base.model";
// ================================
// DOCUMENTO
// ================================
const documentoSchema = new Schema({
  ...baseSchemaFields,
  pessoa_id: {
    type: Schema.Types.ObjectId,
    ref: 'Pessoa',
    required: true
  },
  tipo: {
    type: String,
    enum: ['RG', 'CPF', 'CNH', 'PASSAPORTE', 'CERTIDAO_NASCIMENTO', 'OUTROS'],
    required: true
  },
  numero: {
    type: String,
    required: true,
    maxlength: 50
  },
  orgao_emissor: {
    type: String,
    maxlength: 100
  },
  data_emissao: Date,
  data_validade: Date,
  imagem_url: {
    type: String,
    maxlength: 255
  },
  verificado: {
    type: Boolean,
    default: false
  }
});

export const DocumentoModel = mongoose.model('Documento', documentoSchema);