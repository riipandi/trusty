import { cors } from 'hono/middleware.ts';

const corsMiddleware = cors({
  origin: '*',
  allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  credentials: true,
  maxAge: 600,
});

export default corsMiddleware;
