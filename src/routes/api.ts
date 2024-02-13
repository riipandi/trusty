import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

import { Bindings } from "@/binding";
import { validateJsonRequest } from "@/http/request";
import { jwtMiddleware } from "@/http/middleware/jwt";
import { LoginRequestSchema } from "@/http/validator/auth";

import * as authHandler from "@/http/handler/auth";
import { apiRootHandler } from "@/http/handler/root";
import * as userHandler from "@/http/handler/user";

const corsMiddleware = cors({
  origin: "*",
  allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
  credentials: true,
  maxAge: 600,
});

const api = new Hono<{ Bindings: Bindings }>();

api.use("*", prettyJSON({ space: 2 }));
api.use("*", secureHeaders());
api.use("*", corsMiddleware);

// Add X-Response-Time header
api.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  c.header("X-Response-Time", `${ms}ms`);
});

api.get("/", apiRootHandler);

api.use("/users/*", jwtMiddleware);
api.get("/users", userHandler.getUsers);
api.get("/users/:id", userHandler.getUserById);

api.post("/auth/login", validateJsonRequest(LoginRequestSchema), authHandler.login);

api.use("/auth/whoami", jwtMiddleware);
api.get("/auth/whoami", authHandler.whoami);

export default api;
