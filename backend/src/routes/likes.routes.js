import { Router } from 'express';
import { setReaction } from '../services/likes.service.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();

r.post('/', requireAuth, async (req, res, next) => {
  try {
    const { movieId, type } = req.body; // type: 1 or -1
    if (![1, -1].includes(type)) return res.status(400).json({ message: 'Invalid type' });
    if (!movieId) return res.status(400).json({ message: 'Missing movieId' });
    const row = await setReaction({ userId: req.user.id, movieId, type });
    res.status(201).json(row);
  } catch (e) { next(e); }
});

export default r;
