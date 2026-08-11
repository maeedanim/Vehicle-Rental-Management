import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import jwtConfig from '../config/jwt.js';
import type { JwtPayload } from '../types/auth.types.js';

function isApplicationJwtPayload(
  payload: string | jwt.JwtPayload,
): payload is jwt.JwtPayload {
  return (
    typeof payload !== 'string' &&
    (typeof payload.sub === 'number' || typeof payload.sub === 'string') &&
    typeof payload.email === 'string' &&
    typeof payload.name === 'string'
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
    const decoded = jwt.verify(token, jwtConfig.secret);

    if (!isApplicationJwtPayload(decoded)) {
      res.status(401).json({
        success: false,
        message: 'Invalid token payload',
      });
      return;
    }

    const userId =
      typeof decoded.sub === 'number'
        ? decoded.sub
        : Number(decoded.sub);

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