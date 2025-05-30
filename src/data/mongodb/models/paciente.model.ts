import mongoose, { Schema } from "mongoose";
import { baseSchemaFields } from "./base.model";
// ================================
// PACIENTE
// ================================
const pacienteSchema = new Schema({
  ...baseSchemaFields,
  pessoa_id: {
    type: Schema.Types.ObjectId,
    ref: 'Pessoa',
    required: true
  },
  numero_cartao_sus: {
    type: String,
    maxlength: 100,
    unique: true,
    sparse: true
  },
  tipo_sanguineo: {
    type: String,
    maxlength: 4,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  alergias: {
    type: String,
    maxlength: 1000
  },
  historico_medico: {
    type: String,
    maxlength: 2000
  },
  medicamentos_uso_continuo: [{
    nome: String,
    dosagem: String,
    frequencia: String
  }],
  contato_emergencia: {
    nome: String,
    parentesco: String,
    telefone: String
  },
  observacoes: String
});

export const PacienteModel = mongoose.model('Paciente', pacienteSchema);