import mongoose, { Schema } from "mongoose";
import { baseSchemaFields } from "./base.model";

// ================================
// AGENDAMENTO
// ================================
const agendamentoSchema = new Schema({
  ...baseSchemaFields,
  paciente_id: {
    type: Schema.Types.ObjectId,
    ref: 'Paciente',
    required: true
  },
  medico_id: {
    type: Schema.Types.ObjectId,
    ref: 'Medico'
  },
  unidade_id: {
    type: Schema.Types.ObjectId,
    ref: 'Unidade',
    required: true
  },
  data_hora: {
    type: Date,
    required: true
  },
  duracao_estimada: {
    type: Number,
    default: 30 // minutos
  },
  tipo_agendamento: {
    type: String,
    enum: ['CONSULTA', 'EXAME', 'PROCEDIMENTO', 'VACINA'],
    required: true
  },
  especialidade: String,
  status: {
    type: String,
    enum: ['AGENDADO', 'CONFIRMADO', 'CANCELADO', 'REAGENDADO', 'REALIZADO'],
    default: 'AGENDADO'
  },
  observacoes: String,
  agendado_por: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  confirmado_em: Date,
  cancelado_em: Date,
  motivo_cancelamento: String
});


export const AgendamentoModel = mongoose.model('Agendamento', agendamentoSchema);