import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { etag } from "hono/etag";

import * as handler from "@/http/handler/root";
import { logger } from "@/http/middleware/logger";
import { onErrorResponse, throwResponse } from "@/http/response";
import apiRoutes from "@/routes/api";

import env from "@/config";

const app = new Hono();

// Global middlewares
app.use("*", logger());
app.use("*", etag());
app.use("*", csrf({ origin: "*" }));

app.get("/", handler.rootHandler);
app.get("/health", handler.healthCheckHandler);

// Error handling
app.notFound((c) => throwResponse(c, 404, "Resource not found"));
app.onError(onErrorResponse);

// Register API routes
app.route("/api", apiRoutes);

serve(
  {
    fetch: app.fetch,
    hostname: env.HOSTNAME,
    port: env.PORT,
  },
  (listener) => {
    const listenAddress = `${listener.address}:${listener.port}`;
    console.info(`Server is listening on: http://${listenAddress}`);
  },
);
