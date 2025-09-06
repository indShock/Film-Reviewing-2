import { Router } from 'express';
import { listComments, addComment, updateComment, deleteComment } from '../services/comments.service.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();

// List comments for a movie
r.get('/:movieId', async (req, res, next) => {
  try {
    const rows = await listComments(req.params.movieId);
    res.json(rows);
  } catch (e) { next(e); }
});

// Add a comment
r.post('/', requireAuth, async (req, res, next) => {
  try {
    const { movieId, text } = req.body;
    if (!movieId || !text) return res.status(400).json({ message: 'Missing movieId or text' });
    const c = await addComment({ userId: req.user.id, movieId, text });
    res.status(201).json(c);
  } catch (e) { next(e); }
});

// Edit own comment
r.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Missing text' });
    const c = await updateComment({ userId: req.user.id, commentId: req.params.id, text });
    res.json(c);
  } catch (e) { next(e); }
});

// Delete own comment
r.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await deleteComment({ userId: req.user.id, commentId: req.params.id });
    res.json(result);
  } catch (e) { next(e); }
});

export default r;
