import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { logger } from '../logger.js';

export async function register({ email, username, password }) {
  const hash = await bcrypt.hash(password, 10);
  try {
    const { rows } = await query(
      'INSERT INTO users(email, username, password_hash) VALUES ($1,$2,$3) RETURNING id, email, username',
      [email, username, hash]
    );
    logger.info(`REGISTER: ${email}`);
    return rows[0];
  } catch (e) {
    if (e.code === '23505') {
      throw Object.assign(new Error('Email or username already exists'), { status: 409 });
    }
    throw e;
  }
}

export async function login({ emailOrUsername, password }) {
  const { rows } = await query(
    'SELECT * FROM users WHERE email=$1 OR username=$1 LIMIT 1',
    [emailOrUsername]
  );
  const user = rows[0];
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const token = jwt.sign(
    { sub: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  logger.info(`LOGIN: ${user.email}`);
  return { token, user: { id: user.id, email: user.email, username: user.username } };
}
