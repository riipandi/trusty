import { jsonResponse, throwResponse } from "@/http/response";
import { Context } from "hono";

export async function invite(c: Context) {
  return jsonResponse(c, "Invite a user by email");
}

export async function generateLink(c: Context) {
  return jsonResponse(c, "Generate a link to send in an email message");
}
