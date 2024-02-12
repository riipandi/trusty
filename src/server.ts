import { serve } from "@hono/node-server";
import { consola } from "consola";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

import { Bindings } from "@/binding";
import * as handler from "@/http/handler/root";
import { onErrorResponse, throwResponse } from "@/http/response";
import apiRoutes from "@/routes/api";

const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 8030;
const app = new Hono();

// Global middlewares
app.use("*", logger());
app.use("*", etag());

app.get("/", handler.rootHandler);
app.get("/health", handler.healthCheckHandler);

// Error handling
app.notFound((c) => throwResponse(c, 404, "Resource not found"));
app.onError(onErrorResponse);

const middleware = new Hono<{ Bindings: Bindings }>();

middleware.use(csrf({ origin: "*" }));
middleware.use(prettyJSON({ space: 2 }));
middleware.use(secureHeaders());

middleware.use(
  cors({
    origin: "*",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    credentials: true,
    maxAge: 600,
  }),
);

// Add X-Response-Time header
middleware.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  c.header("X-Response-Time", `${ms}ms`);
});

app.route("/api", middleware);
app.route("/api", apiRoutes);

consola.info(`Server is listening on http://${hostname}:${port}`);

serve({ fetch: app.fetch, hostname, port });
