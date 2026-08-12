import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import env from '../config/env.js';
import type { JwtPayload } from '../types/auth.types.js';

function isJwtPayload(
  decoded: string | jwt.JwtPayload,
): decoded is jwt.JwtPayload {
  if (typeof decoded === 'string') {
    return false;
  }

  const { sub, email, name } = decoded;

  return (
    (typeof sub === 'number' || typeof sub === 'string') &&
    typeof email === 'string' &&
    typeof name === 'string'
  );
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    res.status(401).json({
      success: false,
      message: 'Authorization header is required',
    });
    return;
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({
      success: false,
      message: 'Invalid authorization format. Use Bearer <token>',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwt.secret);

    if (!isJwtPayload(decoded)) {
      res.status(401).json({
        success: false,
        message: 'Invalid token payload',
      });
      return;
    }

    const userId = Number(decoded.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(401).json({
        success: false,
        message: 'Invalid user ID in token',
      });
      return;
    }

    const user: JwtPayload = {
      sub: userId,
      email: decoded.email,
      name: decoded.name,
    };

    req.user = user;

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
}