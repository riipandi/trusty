import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { etag } from "hono/etag";
import { getRuntimeKey } from "hono/adapter";
import { showRoutes } from "hono/dev";

import { logger } from "@/http/middleware/logger";
import { onErrorResponse, throwResponse } from "@/http/response";

import apiRoutes from "@/routes/api";
import webRoutes from "@/routes/web";
import env from "@/config";

const app = new Hono();

// Global middlewares
app.use("*", logger());
app.use("*", etag());
app.use("*", csrf({ origin: "*" }));

// Error handling
app.notFound((c) => {
  // Check if it's an API request
  if (c.req.url.includes("/api")) {
    return throwResponse(c, 404, "Resource not found");
  }
  return c.html("Not found", 404);
});

app.onError(onErrorResponse);

// Register application routes
app.get("/", (c) => c.redirect("/ui", 302));
app.route("/api", apiRoutes);
app.route("/ui", webRoutes);

showRoutes(app);

const hostname = env.HOSTNAME;
const port = env.PORT;

serve({ fetch: app.fetch, hostname, port }, (listener) => {
  const listenAddress = `${listener.address}:${listener.port}`;
  console.info(`Server runnin on ${getRuntimeKey()}: http://${listenAddress}`);
});
