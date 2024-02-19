import type { Context, Next } from 'hono/mod.ts';

// Append X-Response-Time header
const responseTimeMiddleware = async (c: Context, next: Next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  c.header('X-Response-Time', `${ms}ms`);
};

export default responseTimeMiddleware;
