import { Router } from 'express';
import { listMovies, getMovie, syncPopular } from '../services/movies.service.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();

r.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '20'), 100);
    const offset = Math.max(parseInt(req.query.offset || '0'), 0);
    const rows = await listMovies({ limit, offset });
    res.json(rows);
  } catch (e) { next(e); }
});

r.get('/:id', async (req, res, next) => {
  try {
    const movie = await getMovie(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (e) { next(e); }
});

// Protected sync endpoint (use in development/admin)
r.post('/sync/popular', requireAuth, async (req, res, next) => {
  try {
    const result = await syncPopular();
    res.json(result);
  } catch (e) { next(e); }
});

export default r;
