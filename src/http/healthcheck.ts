import { Context } from "hono";

export default async function healthCheck(c: Context) {
  return c.text("OK");
}
