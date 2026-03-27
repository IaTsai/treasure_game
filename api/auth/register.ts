import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcrypt';
import { getDb } from '../_db';
import { signToken } from '../_auth';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    return res.status(400).json({ error: '使用者名稱至少需要 3 個字元' });
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: '密碼至少需要 6 個字元' });
  }

  const db = getDb();
  const trimmedUsername = username.trim();

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(trimmedUsername);
  if (existing) {
    return res.status(409).json({ error: '使用者名稱已被使用' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(trimmedUsername, passwordHash);

  const token = signToken(result.lastInsertRowid as number, trimmedUsername);
  res.status(201).json({
    token,
    user: { id: result.lastInsertRowid, username: trimmedUsername },
  });
}
