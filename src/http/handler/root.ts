import { Context } from 'hono/mod.ts';
import { jsonResponse } from '@/http/response.ts';

export async function index(c: Context) {
  return jsonResponse(c, 'Trusty API v1');
}

export async function settings(c: Context) {
  return jsonResponse(c, 'Retrieve some of the public settings of the server');
}

export async function healthCheck(c: Context) {
  return jsonResponse(c, 'OK');
}
