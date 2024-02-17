import type { Context, Next } from "hono";
import { jwt } from "hono/jwt";
import { AppConfig } from "@/config";

export const jwtMiddleware = (c: Context, next: Next) => {
  const { APP_SECRET_KEY } = AppConfig(c);
  const middleware = jwt({ secret: APP_SECRET_KEY, cookie: "_sess_token" });
  return middleware(c, next);
};
