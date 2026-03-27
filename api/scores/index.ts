import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_db';
import { verifyToken } from '../_auth';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: '未提供認證 token' });
  }

  const db = getDb();

  if (req.method === 'POST') {
    const { score, result } = req.body;

    if (typeof score !== 'number') {
      return res.status(400).json({ error: '分數格式不正確' });
    }
    if (!['Win', 'Tie', 'Loss'].includes(result)) {
      return res.status(400).json({ error: '結果必須是 Win、Tie 或 Loss' });
    }

    const row = db.prepare(
      'INSERT INTO scores (user_id, score, result) VALUES (?, ?, ?)'
    ).run(user.userId, score, result);

    const saved = db.prepare('SELECT id, score, result, played_at FROM scores WHERE id = ?').get(row.lastInsertRowid);
    return res.status(201).json(saved);
  }

  if (req.method === 'GET') {
    const scores = db.prepare(
      'SELECT id, score, result, played_at FROM scores WHERE user_id = ? ORDER BY played_at DESC'
    ).all(user.userId);

    const stats = db.prepare(`
      SELECT
        COUNT(*) as totalGames,
        SUM(CASE WHEN result = 'Win' THEN 1 ELSE 0 END) as wins,
        SUM(score) as totalScore
      FROM scores WHERE user_id = ?
    `).get(user.userId) as { totalGames: number; wins: number; totalScore: number };

    return res.json({ scores, stats });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
