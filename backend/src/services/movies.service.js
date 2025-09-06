import axios from 'axios';
import { query } from '../db.js';
import { logger } from '../logger.js';

const TMDB = axios.create({
  baseURL: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  params: { api_key: process.env.TMDB_API_KEY, language: 'en-US' }
});

export async function listMovies({ limit = 20, offset = 0 }) {
  const { rows } = await query(
    'SELECT m.*, s.likes, s.dislikes, s.comments FROM movies m LEFT JOIN movie_stats s ON s.movie_id = m.id ORDER BY m.updated_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return rows;
}

export async function getMovie(id) {
  const { rows } = await query(
    'SELECT m.*, s.likes, s.dislikes, s.comments FROM movies m LEFT JOIN movie_stats s ON s.movie_id = m.id WHERE m.id=$1',
    [id]
  );
  return rows[0] || null;
}

export async function syncPopular() {
  const { data } = await TMDB.get('/movie/popular');
  const items = data.results || [];
  let upserted = 0;
  for (const it of items) {
    const id = it.id;
    const title = it.title;
    const description = it.overview || '';
    const poster_url = it.poster_path ? `https://image.tmdb.org/t/p/w342${it.poster_path}` : null;
    await query(
      `INSERT INTO movies(id, title, description, poster_url, updated_at)
       VALUES ($1,$2,$3,$4,NOW())
       ON CONFLICT (id)
       DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, poster_url=EXCLUDED.poster_url, updated_at=NOW()`,
      [id, title, description, poster_url]
    );
    upserted++;
  }
  logger.info(`SYNC_POPULAR: upserted ${upserted}`);
  return { upserted };
}
