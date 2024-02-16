import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

import { Bindings } from "@/global";
import { jwtMiddleware } from "@/http/middleware/jwt";
import { validateJsonRequest } from "@/http/request";
import { LoginRequestSchema } from "@/http/validator/auth";

import * as authHandler from "@/http/handler/auth";
import * as userHandler from "@/http/handler/user";
import healthcheck from "@/http/healthcheck";
import { jsonResponse } from "@/http/response";

const corsMiddleware = cors({
  origin: "*",
  allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
  credentials: true,
  maxAge: 600,
});

const route = new Hono<{ Bindings: Bindings }>();

route.use("*", prettyJSON({ space: 2 }));
route.use("*", secureHeaders());
route.use("*", corsMiddleware);

// Add X-Response-Time header
route.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  c.header("X-Response-Time", `${ms}ms`);
});

route.get("/", (c) => jsonResponse(c, `Trusty API v1`));

route.get("/health", healthcheck);

route.use("/users/*", jwtMiddleware);
route.get("/users", userHandler.getUsers);
route.get("/users/:id", userHandler.getUserById);

route.post("/auth/login", validateJsonRequest(LoginRequestSchema), authHandler.login);

route.use("/auth/whoami", jwtMiddleware);
route.get("/auth/whoami", authHandler.whoami);

export default route;
