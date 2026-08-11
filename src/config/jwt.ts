import env from './env.js';

const jwtConfig = {
  secret: env.jwt.secret,
  expiresIn: env.jwt.expiresIn,
} as const;

export default jwtConfig;