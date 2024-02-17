import { consola } from "consola";
import { Context } from "hono";
import * as Jwt from "hono/jwt";
import { typeid } from "typeid-js";

import { AppConfig } from "@/config";
import { JwtPayload } from "@/http/middleware/jwt";
import { jsonResponse } from "@/http/response";
import type { LoginRequest } from "@/http/validator/auth";

export async function token(c: Context) {
  const { email } = await c.req.json<LoginRequest>();
  const { APP_SECRET_KEY } = AppConfig(c);

  const expiresIn = 3600;
  const issuer = "Trusty Auth";
  const sessionId = typeid("sess").toString();
  const tokenId = typeid("jti").toString();

  const payload: JwtPayload = {
    sub: sessionId,
    aud: email,
    iss: issuer,
    jti: tokenId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };

  const access_token = await Jwt.sign(payload, APP_SECRET_KEY, "HS256");

  return jsonResponse(c, "Issues access and refresh tokens based on grant type", {
    access_token,
  });
}

export async function logout(c: Context) {
  return jsonResponse(c, "Logs out a user");
}

export async function verifyGet(c: Context) {
  const message =
    "Authenticate by verifying the posession of a one time token usually for use as clickable links";
  return jsonResponse(c, message);
}

export async function verifyPost(c: Context) {
  return jsonResponse(c, "Authenticate by verifying the posession of a one time token");
}

export async function signup(c: Context) {
  return jsonResponse(c, "Signs a user up");
}

export async function recover(c: Context) {
  return jsonResponse(c, "Request password recovery");
}

export async function resend(c: Context) {
  return jsonResponse(c, "Resends a one time password otp through email or sms");
}

export async function magiclink(c: Context) {
  return jsonResponse(c, "Authenticate a user by sending them a magic link");
}

export async function otp(c: Context) {
  return jsonResponse(
    c,
    "Authenticate a user by sending them a one time password over email or sms",
  );
}
