import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { getRuntimeKey } from "hono/adapter";
import { csrf } from "hono/csrf";
import { showRoutes } from "hono/dev";
import { etag } from "hono/etag";
import { getPath } from "hono/utils/url";

import env from "@/config";
import { logger } from "@/http/middleware/logger";
import { onErrorResponse, throwResponse } from "@/http/response";
import apiRoutes from "@/routes/api";
import webRoutes from "@/routes/web";

const app = new Hono();

// Global middlewares
app.use("*", logger());
app.use("*", etag());
app.use("*", csrf({ origin: "*" }));

// Error handling
app.notFound((c) => {
  // Check if it's an API request
  const path = getPath(c.req.raw);
  if (path.startsWith("/api")) {
    return throwResponse(c, 404, "Resource not found");
  }
  return c.html("Not found", 404);
});

app.onError(onErrorResponse);

// Serve static files
app.use(
  "/assets/*",
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) => path.replace(/^\/assets/, "/public"),
  }),
);
app.use("/favicon.ico", serveStatic({ path: "./public/favicon.ico" }));
app.use("/robots.txt", serveStatic({ path: "./public/robots.txt" }));

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
