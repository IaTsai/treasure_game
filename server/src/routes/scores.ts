import { Router, Response } from 'express';
import db from '../db.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/scores
router.post('/', (req: AuthRequest, res: Response) => {
  const { score, result } = req.body;

  if (typeof score !== 'number') {
    res.status(400).json({ error: '分數格式不正確' });
    return;
  }
  if (!['Win', 'Tie', 'Loss'].includes(result)) {
    res.status(400).json({ error: '結果必須是 Win、Tie 或 Loss' });
    return;
  }

  const row = db.prepare(
    'INSERT INTO scores (user_id, score, result) VALUES (?, ?, ?)'
  ).run(req.user!.userId, score, result);

  const saved = db.prepare('SELECT id, score, result, played_at FROM scores WHERE id = ?').get(row.lastInsertRowid);
  res.status(201).json(saved);
});

// GET /api/scores
router.get('/', (req: AuthRequest, res: Response) => {
  const scores = db.prepare(
    'SELECT id, score, result, played_at FROM scores WHERE user_id = ? ORDER BY played_at DESC'
  ).all(req.user!.userId);

  const stats = db.prepare(`
    SELECT
      COUNT(*) as totalGames,
      SUM(CASE WHEN result = 'Win' THEN 1 ELSE 0 END) as wins,
      SUM(score) as totalScore
    FROM scores WHERE user_id = ?
  `).get(req.user!.userId) as { totalGames: number; wins: number; totalScore: number };

  res.json({ scores, stats });
});

export default router;
