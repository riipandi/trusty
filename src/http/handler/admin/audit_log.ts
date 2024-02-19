import { Context } from 'hono/mod.ts';
import { jsonResponse } from '@/http/response.ts';

export async function getAll(c: Context) {
  return jsonResponse(c, 'Fetch audit log events');
}
