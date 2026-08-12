import type { RequestHandler } from 'express';
import { AppError } from '../utils/app-error.js';

export const notFoundMiddleware: RequestHandler = (
  req,
  _res,
  next,
): void => {
  next(
    new AppError(
      `Route ${req.method} ${req.originalUrl} not found.`,
      404,
    ),
  );
};