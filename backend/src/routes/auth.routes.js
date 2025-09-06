import { Router } from 'express';
import { register, login } from '../services/auth.service.js';

const r = Router();

r.post('/register', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await register({ email, username, password });
    res.status(201).json(user);
  } catch (e) { next(e); }
});

r.post('/login', async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) return res.status(400).json({ message: 'Missing fields' });
    const data = await login({ emailOrUsername, password });
    res.json(data);
  } catch (e) { next(e); }
});

export default r;
