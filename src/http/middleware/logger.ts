import type { MiddlewareHandler } from "hono/types";
import { getPath } from "hono/utils/url";

enum LogPrefix {
  Incoming = "[REQ]",
  Outgoing = "[RES]",
  Error = "[ERR]",
}

const humanize = (times: string[]) => {
  const [delimiter, separator] = [",", "."];
  const find = /(\d)(?=(\d\d\d)+(?!\d))/g;
  const orderTimes = times.map((v) => v.replace(find, `$1 ${delimiter}`));
  return orderTimes.join(separator);
};

const time = (start: number) => {
  const delta = Date.now() - start;
  const rounded = Math.round(delta / 1000);
  return humanize([delta < 1000 ? `${delta}ms` : `${rounded}s`]);
};

const colorStatus = (status: number) => {
  const out: { [key: string]: string } = {
    7: `\x1b[35m${status}\x1b[0m`,
    5: `\x1b[31m${status}\x1b[0m`,
    4: `\x1b[33m${status}\x1b[0m`,
    3: `\x1b[36m${status}\x1b[0m`,
    2: `\x1b[32m${status}\x1b[0m`,
    1: `\x1b[32m${status}\x1b[0m`,
    0: `\x1b[33m${status}\x1b[0m`,
  };

  const calculateStatus = (status / 100) | 0;

  return out[calculateStatus];
};

const colorMethod = (method: string) => {
  const out: { [key: string]: string } = {
    GET: `\x1b[36m${method}\x1b[0m`,
    POST: `\x1b[32m${method}\x1b[0m`,
    PUT: `\x1b[33m${method}\x1b[0m`,
    PATCH: `\x1b[33m${method}\x1b[0m`,
    DELETE: `\x1b[31m${method}\x1b[0m`,
  };

  return out[method];
};

type PrintFunc = (str: string, ...rest: string[]) => void;

function log(
  fn: PrintFunc,
  prefix: string,
  method: string,
  path: string,
  clientAddr: string,
  userAgent: string | undefined,
  status = 0,
  elapsed?: string,
) {
  const timestamp = new Date().toISOString();
  const defaultLogger = `${prefix} ${timestamp} ${colorMethod(method)} ${clientAddr} ${path}`;
  const uAgent = userAgent ?? "";
  const out =
    prefix === LogPrefix.Incoming
      ? `${defaultLogger} ${uAgent}`
      : `${defaultLogger} ${colorStatus(status)} ${elapsed}`;
  fn(out);
}

export const logger = (fn: PrintFunc = console.log): MiddlewareHandler => {
  return async function logger(c, next) {
    const { method } = c.req;

    const clientAddr = c.env.incoming.socket.remoteAddress;
    const userAgent = c.req.header("User-Agent");
    const path = getPath(c.req.raw);

    log(fn, LogPrefix.Incoming, method, path, clientAddr, userAgent);

    const start = Date.now();

    await next();

    log(fn, LogPrefix.Outgoing, method, path, clientAddr, userAgent, c.res.status, time(start));
  };
};
