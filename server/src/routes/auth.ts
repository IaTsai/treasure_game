import { Router, Response } from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js';
import { AuthRequest, authMiddleware, signToken } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', (req: AuthRequest, res: Response) => {
  const { username, password } = req.body;

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    res.status(400).json({ error: '使用者名稱至少需要 3 個字元' });
    return;
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ error: '密碼至少需要 6 個字元' });
    return;
  }

  const trimmedUsername = username.trim();

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(trimmedUsername);
  if (existing) {
    res.status(409).json({ error: '使用者名稱已被使用' });
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(trimmedUsername, passwordHash);

  const token = signToken(result.lastInsertRowid as number, trimmedUsername);
  res.status(201).json({
    token,
    user: { id: result.lastInsertRowid, username: trimmedUsername },
  });
});

// POST /api/auth/login
router.post('/login', (req: AuthRequest, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: '請輸入使用者名稱和密碼' });
    return;
  }

  const user = db.prepare('SELECT id, username, password_hash FROM users WHERE username = ?').get(username.trim()) as
    | { id: number; username: string; password_hash: string }
    | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ error: '使用者名稱或密碼錯誤' });
    return;
  }

  const token = signToken(user.id, user.username);
  res.json({
    token,
    user: { id: user.id, username: user.username },
  });
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ id: req.user!.userId, username: req.user!.username });
});

export default router;
