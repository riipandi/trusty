import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";

export function jsonResponse<T>(
  ctx: Context,
  message?: string,
  payload?: Record<string, T>,
  status?: StatusCode,
): Response {
  const statusCode = status || 200;
  const code = status && typeof status === "number" ? status : undefined;
  return ctx.json({ code, message, ...payload }, statusCode);
}

export function throwResponse(ctx: Context, status: StatusCode, message?: string): Response {
  const statusCode = typeof status === "number" ? status : 500;
  const errMessage = message ? message : statusCode; // getStatusText(statusCode)
  return ctx.json({ code: statusCode, message: errMessage }, statusCode);
}

export async function onErrorResponse(err: Error, c: Context) {
  if (err instanceof HTTPException) {
    const resp = err.getResponse();
    const respText = await resp.text();
    return throwResponse(c, err.status, respText);
  }
  const errMessage = err instanceof Error ? err.message : "Something wrong";
  return throwResponse(c, 500, errMessage);
}
