import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { etag } from "hono/etag";

import { logger } from "@/http/middleware/logger";
import { onErrorResponse, throwResponse } from "@/http/response";

import adminRoutes from "@/routes/admin";
import apiRoutes from "@/routes/api";
import webRoutes from "@/routes/web";

import env from "@/config";

const app = new Hono();

// Global middlewares
app.use("*", logger());
app.use("*", etag());
app.use("*", csrf({ origin: "*" }));

app.get("/", (c) => c.redirect("/ui"));

// Error handling
app.notFound((c) => {
  // Check if it's an API request
  if (c.req.url.includes("/api")) {
    return throwResponse(c, 404, "Resource not found");
  }
  return c.html("Not found");
});

app.onError(onErrorResponse);

// Register API routes
app.route("/api", apiRoutes);
app.route("/ui", webRoutes);
app.route("/admin", adminRoutes);

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
