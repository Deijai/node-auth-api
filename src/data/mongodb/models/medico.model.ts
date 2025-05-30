import mongoose, { Schema } from "mongoose";
import { baseSchemaFields } from "./base.model";
// ================================
// MÉDICO
// ================================
const medicoSchema = new Schema({
  ...baseSchemaFields,
  pessoa_id: {
    type: Schema.Types.ObjectId,
    ref: 'Pessoa',
    required: true
  },
  crm: {
    type: String,
    required: true,
    maxlength: 20
  },
  especialidade: {
    type: String,
    required: true,
    maxlength: 255
  },
  conselho_estado: {
    type: String,
    required: true,
    maxlength: 2
  },
  data_formacao: Date,
  instituicao_formacao: String,
  residencias: [{
    especialidade: String,
    instituicao: String,
    ano_inicio: Number,
    ano_fim: Number
  }],
  unidades_vinculadas: [{
    type: Schema.Types.ObjectId,
    ref: 'Unidade'
  }],
  horarios_atendimento: [{
    dia_semana: {
      type: Number,
      min: 0,
      max: 6
    },
    hora_inicio: String,
    hora_fim: String,
    unidade_id: {
      type: Schema.Types.ObjectId,
      ref: 'Unidade'
    }
  }],
  valor_consulta: Number,
  aceita_convenio: Boolean,
  convenios: [String]
});

export const MedicoModel = mongoose.model('Medico', medicoSchema);