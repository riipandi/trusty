import { jsonResponse } from "@/http/response";
import { Context } from "hono";

export async function rootHandler(c: Context) {
  return c.text("This is will be replaced wit the UI");
}

export async function adminDashboardHandler(c: Context) {
  return c.text("This is will be replaced wit the admin dashboard");
}

export async function apiRootHandler(c: Context) {
  return jsonResponse(c, `Trusty API v1`);
}

export async function healthCheckHandler(c: Context) {
  return c.text("OK");
}
