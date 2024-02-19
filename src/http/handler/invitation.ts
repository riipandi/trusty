import { Context } from 'hono/mod.ts';
import { jsonResponse } from '@/http/response.ts';

export async function invite(c: Context) {
  return jsonResponse(c, 'Invite a user by email');
}

export async function generateLink(c: Context) {
  return jsonResponse(c, 'Generate a link to send in an email message');
}
