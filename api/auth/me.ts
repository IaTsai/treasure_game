import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../_auth';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: '未提供認證 token' });
  }

  res.json({ id: user.userId, username: user.username });
}
