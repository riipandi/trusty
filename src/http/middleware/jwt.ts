import type { Context, Next } from "hono";
import { jwt } from "hono/jwt";

export const jwtMiddleware = (c: Context, next: Next) => {
  const jwtSecret = c.env.JWT_SECRET || "sup3r-duper-Secret-key";
  const middleware = jwt({ secret: jwtSecret, cookie: "_sess_token" });
  return middleware(c, next);
};
