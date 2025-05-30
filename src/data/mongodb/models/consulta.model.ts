import mongoose, { Schema } from "mongoose";
import { baseSchemaFields } from "./base.model";

// ================================
// CONSULTA/ATENDIMENTO
// ================================
const consultaSchema = new Schema({
  ...baseSchemaFields,
  paciente_id: {
    type: Schema.Types.ObjectId,
    ref: 'Paciente',
    required: true
  },
  medico_id: {
    type: Schema.Types.ObjectId,
    ref: 'Medico',
    required: true
  },
  unidade_id: {
    type: Schema.Types.ObjectId,
    ref: 'Unidade',
    required: true
  },
  data_hora_agendada: {
    type: Date,
    required: true
  },
  data_hora_inicio: Date,
  data_hora_fim: Date,
  tipo_consulta: {
    type: String,
    enum: ['PRIMEIRA_VEZ', 'RETORNO', 'EMERGENCIA', 'URGENCIA', 'PREVENTIVA'],
    required: true
  },
  especialidade: String,
  status: {
    type: String,
    enum: ['AGENDADA', 'CONFIRMADA', 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA', 'NAO_COMPARECEU'],
    default: 'AGENDADA'
  },
  motivo_consulta: String,
  sintomas: String,
  diagnostico: String,
  observacoes: String,
  receituario: [{
    medicamento: String,
    dosagem: String,
    frequencia: String,
    duracao: String,
    observacoes: String
  }],
  exames_solicitados: [{
    tipo_exame: String,
    laboratorio: String,
    observacoes: String,
    urgente: Boolean
  }],
  sinais_vitais: {
    pressao_arterial: String,
    temperatura: Number,
    frequencia_cardiaca: Number,
    frequencia_respiratoria: Number,
    saturacao_oxigenio: Number,
    peso: Number,
    altura: Number,
    imc: Number
  },
  triagem: {
    prioridade: {
      type: String,
      enum: ['VERDE', 'AMARELA', 'LARANJA', 'VERMELHA', 'AZUL'],
      default: 'VERDE'
    },
    classificacao_manchester: String,
    tempo_espera_max: Number
  },
  valor_consulta: Number,
  forma_pagamento: {
    type: String,
    enum: ['SUS', 'PARTICULAR', 'CONVENIO', 'GRATUITO']
  },
  convenio: String
});

export const ConsultaModel = mongoose.model('Consulta', consultaSchema);