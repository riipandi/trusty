import type { Context, Next } from 'hono/mod.ts';
import { jwt } from 'hono/middleware.ts';
import { AppConfig } from '@/config.ts';

export type JwtPayload = {
  sub: string;
  jti: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
};

const jwtMiddleware = (c: Context, next: Next) => {
  const { APP_SECRET_KEY } = AppConfig(c);
  const middleware = jwt({ secret: APP_SECRET_KEY, cookie: '_sess_token' });
  return middleware(c, next);
};

export default jwtMiddleware;
