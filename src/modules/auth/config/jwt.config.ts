import type { Config } from './jwt-config.interface';

export function JwtConfig(): Config {
  return {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRE_IN || '1h',
  };
}
