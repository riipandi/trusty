import { Hono } from "hono";

import { Bindings } from "@/binding";
import { jwtMiddleware } from "@/http/middleware";
import { validateJsonRequest } from "@/http/request";
import { LoginRequestSchema } from "@/http/validator/auth";

import * as authHandler from "@/http/handler/auth";
import { apiRootHandler } from "@/http/handler/root";
import * as userHandler from "@/http/handler/user";

const api = new Hono<{ Bindings: Bindings }>();

api.get("/", apiRootHandler);

api.use("/users/*", jwtMiddleware);
api.get("/users", userHandler.getUsers);
api.get("/users/:id", userHandler.getUserById);

api.post("/auth/login", validateJsonRequest(LoginRequestSchema), authHandler.login);

export default api;
