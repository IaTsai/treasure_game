import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import scoreRoutes from './routes/scores.js';
import './db.js'; // Initialize database

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
