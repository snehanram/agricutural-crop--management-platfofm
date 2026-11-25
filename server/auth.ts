import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { db } from './db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'krishifield-local-dev-secret-change-in-prod';

export interface FarmerPayload {
  id: number;
  email: string;
  full_name: string;
  preferred_language: string;
}

export interface AuthenticatedRequest extends Request {
  farmer?: FarmerPayload;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload: FarmerPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): FarmerPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as FarmerPayload;
  } catch {
    return null;
  }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication token required' });
    return;
  }

  const token = authHeader.slice(7).trim();
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: 'Invalid or expired authentication token' });
    return;
  }

  const farmer = db
    .prepare('SELECT id, email, full_name, preferred_language FROM farmers WHERE id = ?')
    .get(decoded.id) as FarmerPayload | undefined;

  if (!farmer) {
    res.status(401).json({ error: 'Farmer account not found' });
    return;
  }

  req.farmer = farmer;
  next();
}
