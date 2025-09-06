import { query } from '../db.js';
import { logger } from '../logger.js';

export async function setReaction({ userId, movieId, type }) {
  // type: 1 or -1
  const { rows } = await query(
    `INSERT INTO likes(user_id, movie_id, type)
     VALUES ($1,$2,$3)
     ON CONFLICT (user_id, movie_id)
     DO UPDATE SET type=EXCLUDED.type, created_at=NOW()
     RETURNING *`,
    [userId, movieId, type]
  );
  logger.info(`REACTION: user=${userId} movie=${movieId} type=${type}`);
  return rows[0];
}
