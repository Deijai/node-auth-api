// types.d.ts ou src/types/express.d.ts
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // ou defina um tipo mais específico, como { id: string, email: string, role: string }
    }
  }
}