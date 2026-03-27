import jwt from 'jsonwebtoken';
import type { VercelRequest } from '@vercel/node';

const JWT_SECRET = process.env.JWT_SECRET || 'treasure-hunt-dev-secret';

export function signToken(userId: number, username: string): string {
  return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(req: VercelRequest): { userId: number; username: string } | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;

  try {
    return jwt.verify(header.slice(7), JWT_SECRET) as { userId: number; username: string };
  } catch {
    return null;
  }
}
