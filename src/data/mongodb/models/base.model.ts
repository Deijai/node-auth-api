import mongoose, { Schema } from "mongoose";

// ================================
// SCHEMA BASE PARA MULTI-TENANT
// ================================
export const baseSchemaFields = {
  tenant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  updated_by: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }
};
