import jwt, { type SignOptions } from 'jsonwebtoken';

import jwtConfig from '../config/jwt.js';
import type { JwtPayload } from '../types/auth.types.js';

export function generateAccessToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: jwtConfig.expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, jwtConfig.secret, options);
}