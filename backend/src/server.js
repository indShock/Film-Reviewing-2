import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { httpLogger, logger } from './logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { pool } from './db.js';

import authRoutes from './routes/auth.routes.js';
import moviesRoutes from './routes/movies.routes.js';
import likesRoutes from './routes/likes.routes.js';
import commentsRoutes from './routes/comments.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(httpLogger);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/comments', commentsRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    const c = await pool.connect();
    await c.query('SELECT 1');
    c.release();
    logger.info(`DB connected`);
  } catch (e) {
    logger.error('DB connection failed: ' + e.message);
  }
  logger.info(`API available on http://localhost:${PORT}`);
});
