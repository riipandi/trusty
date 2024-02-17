import { Context } from "hono";
import { jsonResponse, throwResponse } from "@/http/response";

export async function getAll(c: Context) {
  return jsonResponse(c, "Fetch audit log events");
}
