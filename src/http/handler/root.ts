import { jsonResponse } from "@/http/response";
import { Context } from "hono";

export async function rootHandler(c: Context) {
  return c.text("Hello, World!");
}

export async function apiRootHandler(c: Context) {
  return jsonResponse(c, `Trusty API v1`);
}

export async function healthCheckHandler(c: Context) {
  return c.text("OK");
}
