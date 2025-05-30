import mongoose, { Schema, Document } from "mongoose";

// Interfaces para type safety
interface ITenantLimites {
  usuarios_max?: number | null;
  pacientes_max?: number | null;
  unidades_max?: number | null;
  consultas_mes_max?: number | null;
  armazenamento_gb?: number | null;
}

interface ITenantPlano {
  tipo: 'BASICO' | 'INTERMEDIARIO' | 'AVANCADO' | 'PERSONALIZADO';
  data_inicio: Date;
  valor_mensal: number;
  status: 'ATIVO' | 'INATIVO' | 'SUSPENSO';
}

interface ITenantConfiguracoes {
  timezone: string;
  logo_url?: string;
  cores_tema?: {
    primaria?: string;
    secundaria?: string;
    acento?: string;
  };
  modulos_ativos?: string[];
  configuracoes_sistema?: {
    permite_agendamento_online?: boolean;
    antecedencia_maxima_agendamento?: number;
    antecedencia_minima_agendamento?: number;
    duracao_padrao_consulta?: number;
    permite_reagendamento?: boolean;
    limite_reagendamentos?: number;
    tempo_limite_cancelamento?: number;
    notificacoes_ativas?: boolean;
    lembrete_antecedencia?: number;
  };
  configuracoes_clinicas?: {
    usa_triagem_manchester?: boolean;
    obrigatorio_sinais_vitais?: boolean;
    obrigatorio_diagnostico_cid?: boolean;
    permite_prescricao_digital?: boolean;
    validade_receita_dias?: number;
    requer_assinatura_digital?: boolean;
  };
  integracao?: {
    sus_integrado?: boolean;
    laboratorio_externo?: boolean;
    farmacia_popular?: boolean;
    telemedicina?: boolean;
    prontuario_eletronico?: boolean;
  };
}

interface ITenant extends Document {
  nome: string;
  codigo: string;
  subdomain: string;
  cnpj?: string;
  endereco?: {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  contato?: {
    telefone?: string;
    email?: string;
    site?: string;
  };
  configuracoes?: ITenantConfiguracoes;
  limites?: ITenantLimites;
  plano?: ITenantPlano;
  status: 'ATIVO' | 'INATIVO' | 'SUSPENSO';
  data_criacao: Date;
  created_by?: string;
  updated_by?: string;
  updated_at?: Date;
  observacoes_suspensao?: string;
  data_suspensao?: Date;
}

// ================================
// TENANT (CIDADE/MUNICÍPIO) - SCHEMA COMPLETO
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
    }],
    // Configurações do sistema
    configuracoes_sistema: {
      permite_agendamento_online: { type: Boolean, default: true },
      antecedencia_maxima_agendamento: { type: Number, default: 30 },
      antecedencia_minima_agendamento: { type: Number, default: 2 },
      duracao_padrao_consulta: { type: Number, default: 30 },
      permite_reagendamento: { type: Boolean, default: true },
      limite_reagendamentos: { type: Number, default: 3 },
      tempo_limite_cancelamento: { type: Number, default: 24 },
      notificacoes_ativas: { type: Boolean, default: true },
      lembrete_antecedencia: { type: Number, default: 24 }
    },
    // Configurações clínicas
    configuracoes_clinicas: {
      usa_triagem_manchester: { type: Boolean, default: false },
      obrigatorio_sinais_vitais: { type: Boolean, default: false },
      obrigatorio_diagnostico_cid: { type: Boolean, default: false },
      permite_prescricao_digital: { type: Boolean, default: true },
      validade_receita_dias: { type: Number, default: 30 },
      requer_assinatura_digital: { type: Boolean, default: false }
    },
    // Integrações
    integracao: {
      sus_integrado: { type: Boolean, default: false },
      laboratorio_externo: { type: Boolean, default: false },
      farmacia_popular: { type: Boolean, default: false },
      telemedicina: { type: Boolean, default: false },
      prontuario_eletronico: { type: Boolean, default: true }
    }
  },
  // PROPRIEDADE LIMITES (estava faltando!)
  limites: {
    usuarios_max: { type: Number, default: null },
    pacientes_max: { type: Number, default: null },
    unidades_max: { type: Number, default: null },
    consultas_mes_max: { type: Number, default: null },
    armazenamento_gb: { type: Number, default: null }
  },
  // PROPRIEDADE PLANO (estava faltando!)
  plano: {
    tipo: {
      type: String,
      enum: ['BASICO', 'INTERMEDIARIO', 'AVANCADO', 'PERSONALIZADO'],
      default: 'BASICO'
    },
    data_inicio: { type: Date, default: Date.now },
    valor_mensal: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['ATIVO', 'INATIVO', 'SUSPENSO'],
      default: 'ATIVO'
    }
  },
  status: {
    type: String,
    enum: ['ATIVO', 'INATIVO', 'SUSPENSO'],
    default: 'ATIVO'
  },
  data_criacao: {
    type: Date,
    default: Date.now
  },
  // Campos de auditoria (estavam faltando!)
  created_by: {
    type: String,
    required: false
  },
  updated_by: {
    type: String,
    required: false
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  // Campos para suspensão (estavam faltando!)
  observacoes_suspensao: {
    type: String,
    required: false
  },
  data_suspensao: {
    type: Date,
    required: false
  }
}, {
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  collection: 'tenants'
});

// Middleware para atualizar updated_at
tenantSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

tenantSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updated_at: new Date() });
  next();
});

// Índices para performance
tenantSchema.index({ cnpj: 1 });
tenantSchema.index({ status: 1 });
tenantSchema.index({ 'plano.tipo': 1 });

export const TenantModel = mongoose.model<ITenant>('Tenant', tenantSchema);