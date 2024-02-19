import { Context } from 'hono/mod.ts';
import { jsonResponse } from '@/http/response.ts';

export async function authorize(c: Context) {
  return jsonResponse(
    c,
    'Redirects to an external oauth provider usually for use as clickable links',
  );
}

export async function callbackGet(c: Context) {
  return jsonResponse(c, 'Redirects oauth flow errors to the frontend app');
}

export async function callbackPost(c: Context) {
  return jsonResponse(c, 'Redirects oauth flow errors to the frontend app 1');
}

export async function sso(c: Context) {
  return jsonResponse(c, 'Initiate a single sign on flow');
}
