import { jsonResponse, throwResponse } from "@/http/response";
import { Context } from "hono";

export async function getAll(c: Context) {
  return jsonResponse(c, "Fetch audit log events");
}
