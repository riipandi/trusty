import { jsonResponse } from "@/http/response";
import { Context } from "hono";

export async function rootHandler(c: Context) {
  return c.text("Hello, World!");
}

export async function apiRootHandler(c: Context) {
  return jsonResponse(c, undefined, {
    remoteAddress: c.env.incoming.socket.remoteAddress,
    userAgent: c.req.header("User-Agent"),
  });
}

export async function healthCheckHandler(c: Context) {
  return c.text("OK");
}
