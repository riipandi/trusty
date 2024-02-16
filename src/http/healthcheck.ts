import { Context } from "hono";
import { jsonResponse } from "./response";

export default async function healthCheck(c: Context) {
  return jsonResponse(c, "OK");
}
