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

api.get("/", (c) => jsonResponse(c, `Trusty API v1`));

//------------------------------------------------------------------------------
// General routes
//------------------------------------------------------------------------------
api.get("/health", healthcheck);
api.get("/settings", (c) => jsonResponse(c, "Retrieve some of the public settings of the server"));

//------------------------------------------------------------------------------
// Authentication routes
//------------------------------------------------------------------------------
api.post("/token", validateJsonRequest(LoginRequestSchema), authHandler.login);
api.post("/logout", (c) => jsonResponse(c, "Logs out a user"));
api.get("/verify", (c) =>
  jsonResponse(
    c,
    "Authenticate by verifying the posession of a one time token usually for use as clickable links",
  ),
);
api.post("/verify", (c) =>
  jsonResponse(c, "Authenticate by verifying the posession of a one time token"),
);
api.post("/signup", (c) => jsonResponse(c, "Signs a user up"));
api.post("/recover", (c) => jsonResponse(c, "Request password recovery"));
api.post("/resend", (c) => jsonResponse(c, "Resends a one time password otp through email or sms"));
api.post("/magiclink", (c) => jsonResponse(c, "Authenticate a user by sending them a magic link"));
api.post("/otp", (c) =>
  jsonResponse(c, "Authenticate a user by sending them a one time password over email or sms"),
);

//------------------------------------------------------------------------------
// OAuth routes
//------------------------------------------------------------------------------
api.get("/authorize", (c) =>
  jsonResponse(c, "Redirects to an external oauth provider usually for use as clickable links"),
);
api.get("/callback", (c) => jsonResponse(c, "Redirects oauth flow errors to the frontend app"));
api.post("/callback", (c) => jsonResponse(c, "Redirects oauth flow errors to the frontend app 1"));
api.post("/sso", (c) => jsonResponse(c, "Initiate a single sign on flow"));

//------------------------------------------------------------------------------
// SAML routes
//------------------------------------------------------------------------------
api.get("/saml/metadata", (c) => jsonResponse(c, "Returns the saml 20 metadata xml"));
api.post("/saml/acs", (c) => jsonResponse(c, "Saml 20 assertion consumer service acs endpoint"));

//------------------------------------------------------------------------------
// User account routes
//------------------------------------------------------------------------------
api.use("/user", jwtMiddleware);
api.get("/user", authHandler.whoami);
api.put("/user", (c) => jsonResponse(c, "Update certain properties of the current user account"));
api.post("/reauthenticate", (c) =>
  jsonResponse(
    c,
    "Reauthenticates the possession of an email or phone number for the purpose of password change",
  ),
);
api.post("/factors", (c) => jsonResponse(c, "Begin enrolling a new factor for mfa"));
api.post("/factors/:factorId/challenge", (c) =>
  jsonResponse(c, "Create a new challenge for a mfa factor"),
);
api.post("/factors/:factorId/verify", (c) => jsonResponse(c, "Verify a challenge on a factor"));
api.delete("/factors/:factorId", (c) => jsonResponse(c, "Remove a mfa factor from a user"));

//------------------------------------------------------------------------------
// Administration routes
//------------------------------------------------------------------------------
api.use("/invite", jwtMiddleware);
api.use("/generate_link", jwtMiddleware);
api.post("/invite", (c) => jsonResponse(c, "Invite a user by email"));
api.post("/generate_link", (c) => jsonResponse(c, "Generate a link to send in an email message"));

const adm = new Hono<{ Bindings: Bindings }>();

adm.use(jwtMiddleware);
adm.get("/audit", (c) => jsonResponse(c, "Fetch audit log events"));
adm.get("/users", userHandler.getUsers);
adm.get("/users/:userId", userHandler.getUserById);
adm.put("/users/:userId", (c) => jsonResponse(c, "Update users account data"));
adm.delete("/users/:userId", (c) => jsonResponse(c, "Delete a user"));

adm.get("/users/:userId/factors", (c) => jsonResponse(c, "List all of the mfa factors for a user"));
adm.put("/users/:userId/factors/:factorId", (c) => jsonResponse(c, "Update a users mfa factor"));
adm.delete("/users/:userId/factors/:factorId", (c) => jsonResponse(c, "Remove a users mfa factor"));

adm.get("/sso/providers", (c) => jsonResponse(c, "Fetch a list of all registered sso providers"));
adm.post("/sso/providers", (c) => jsonResponse(c, "Register a new sso provider"));
adm.get("/sso/providers/:ssoProviderId", (c) => jsonResponse(c, "Fetch sso provider details"));
adm.put("/sso/providers/:ssoProviderId", (c) =>
  jsonResponse(c, "Update details about a sso provider"),
);
adm.delete("/sso/providers/:ssoProviderId", (c) => jsonResponse(c, "Remove an sso provider"));

api.route("/admin", adm);

export default api;
