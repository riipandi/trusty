import { jsonResponse } from "@/http/response";
import { Context } from "hono";

export async function index(c: Context) {
  return jsonResponse(c, "Trusty API v1");
}

export async function settings(c: Context) {
  return jsonResponse(c, "Retrieve some of the public settings of the server");
}

export async function healthCheck(c: Context) {
  return jsonResponse(c, "OK");
}
