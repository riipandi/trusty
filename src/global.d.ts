import { type HttpBindings } from "@hono/node-server";

export type Bindings = HttpBindings & {
  JWT_SECRET: string;
};

export type JwtPayload = {
  sub: string;
  jti: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
};
