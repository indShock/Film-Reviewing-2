import { logger } from '../logger.js';

export function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.url} -> ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
}
