import { query } from '../db.js';
import { logger } from '../logger.js';

export async function listComments(movieId) {
  const { rows } = await query(
    `SELECT c.id, c.text, c.created_at, c.updated_at,
            u.id as user_id, u.username
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.movie_id=$1
     ORDER BY c.created_at DESC`,
    [movieId]
  );
  return rows;
}

export async function addComment({ userId, movieId, text }) {
  const { rows } = await query(
    'INSERT INTO comments(user_id, movie_id, text) VALUES ($1,$2,$3) RETURNING *',
    [userId, movieId, text]
  );
  const c = rows[0];
  logger.info(`COMMENT_ADD: user=${userId} movie=${movieId} id=${c.id}`);
  return c;
}

export async function updateComment({ userId, commentId, text }) {
  const { rows } = await query(
    'UPDATE comments SET text=$1, updated_at=NOW() WHERE id=$2 AND user_id=$3 RETURNING *',
    [text, commentId, userId]
  );
  const c = rows[0];
  if (!c) throw Object.assign(new Error('Comment not found'), { status: 404 });
  logger.info(`COMMENT_EDIT: user=${userId} id=${commentId}`);
  return c;
}

export async function deleteComment({ userId, commentId }) {
  const { rowCount } = await query(
    'DELETE FROM comments WHERE id=$1 AND user_id=$2',
    [commentId, userId]
  );
  if (!rowCount) throw Object.assign(new Error('Comment not found'), { status: 404 });
  logger.info(`COMMENT_DELETE: user=${userId} id=${commentId}`);
  return { success: true };
}
