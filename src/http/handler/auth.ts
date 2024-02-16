import { consola } from "consola";
import { Context } from "hono";
import * as Jwt from "hono/jwt";
import { typeid } from "typeid-js";

import { JwtPayload } from "@/global";
import { jsonResponse, throwResponse } from "@/http/response";
import type { LoginRequest } from "@/http/validator/auth";

export async function login(c: Context) {
  const { username } = await c.req.json<LoginRequest>();

  const jwtSecret = c.env.JWT_SECRET || "sup3r-duper-Secret-key";
  const expiresIn = 3600;

  const issuer = "Trusty Auth";
  const sessionId = typeid("sess").toString();
  const tokenId = typeid("jti").toString();

  const payload: JwtPayload = {
    sub: sessionId,
    aud: username,
    iss: issuer,
    jti: tokenId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };

  const access_token = await Jwt.sign(payload, jwtSecret, "HS256");

  return jsonResponse(c, undefined, { access_token });
}

export async function whoami(c: Context) {
  const jwtPayload = c.get("jwtPayload") as JwtPayload;
  console.info("jwtPayload", jwtPayload);

  if (!jwtPayload) {
    return throwResponse(c, 201, "No data");
  }

  const payload = {
    remoteAddress: c.env.incoming.socket.remoteAddress,
    userAgent: c.req.header("User-Agent"),
    jwt: jwtPayload,
  };

  return jsonResponse(c, undefined, payload);
}
