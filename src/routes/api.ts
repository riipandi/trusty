import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

import { GlobalEnv } from "@/global";
import jwtMiddleware from "@/http/middleware/jwt";
import corsMiddleware from "@/http/middleware/cors";
import responseTimeMiddleware from "@/http/middleware/response_time";

import { validateJsonRequest } from "@/http/request";
import { TokenRequestSchema } from "@/http/validator/auth";

import * as rootHandler from "@/http/handler/root";
import * as authHandler from "@/http/handler/auth";
import * as oauthHandler from "@/http/handler/oauth";
import * as samlHandler from "@/http/handler/saml";
import * as userHandler from "@/http/handler/user";
import * as invitationRoute from "@/http/handler/invitation";
import * as adminAuditRoute from "@/http/handler/admin/audit_log";
import * as adminUsersRoute from "@/http/handler/admin/admin_users";
import * as adminSSORoute from "@/http/handler/admin/admin_sso";

const api = new Hono<GlobalEnv>();

// Register global middlewares for API
api.use("*", prettyJSON({ space: 2 }));
api.use("*", secureHeaders());
api.use("*", corsMiddleware);
api.use("*", responseTimeMiddleware);

//------------------------------------------------------------------------------
// General routes
//------------------------------------------------------------------------------
api.get("/", rootHandler.index);
api.get("/health", rootHandler.healthCheck);
api.get("/settings", rootHandler.settings);

//------------------------------------------------------------------------------
// Authentication routes
//------------------------------------------------------------------------------
api.post("/token", validateJsonRequest(TokenRequestSchema), authHandler.token);
api.post("/logout", authHandler.logout);
api.get("/verify", authHandler.verifyGet);
api.post("/verify", authHandler.verifyPost);
api.post("/signup", authHandler.signup);
api.post("/recover", authHandler.recover);
api.post("/resend", authHandler.resend);
api.post("/magiclink", authHandler.magiclink);
api.post("/otp", authHandler.otp);

//------------------------------------------------------------------------------
// OAuth routes
//------------------------------------------------------------------------------
api.get("/authorize", oauthHandler.authorize);
api.get("/callback", oauthHandler.callbackGet);
api.post("/callback", oauthHandler.callbackPost);
api.post("/sso", oauthHandler.sso);

//------------------------------------------------------------------------------
// SAML routes
//------------------------------------------------------------------------------
api.get("/saml/metadata", samlHandler.metadata);
api.post("/saml/acs", samlHandler.acs);

//------------------------------------------------------------------------------
// User account routes
//------------------------------------------------------------------------------
const protectedRoute = new Hono<GlobalEnv>();
protectedRoute.use("/user", jwtMiddleware);

protectedRoute.get("/user", userHandler.userInfo);
protectedRoute.put("/user", userHandler.updateUser);
protectedRoute.post("/reauthenticate", userHandler.reauthenticate);
protectedRoute.post("/factors", userHandler.mfaEnroll);
protectedRoute.post("/factors/:factorId/challenge", userHandler.createMfaChallenge);
protectedRoute.post("/factors/:factorId/verify", userHandler.verifyMfaChallenge);
protectedRoute.delete("/factors/:factorId", userHandler.removeMfaFactor);

//------------------------------------------------------------------------------
// Administration routes
//------------------------------------------------------------------------------
protectedRoute.post("/invite", invitationRoute.invite);
protectedRoute.post("/generate_link", invitationRoute.generateLink);

const adminRoute = new Hono<GlobalEnv>().basePath("/admin");

adminRoute.use(jwtMiddleware);

adminRoute.get("/audit", adminAuditRoute.getAll);
adminRoute.get("/users", adminUsersRoute.getUsers);
adminRoute.get("/users/:userId", adminUsersRoute.getUserById);
adminRoute.put("/users/:userId", adminUsersRoute.updateUser);
adminRoute.delete("/users/:userId", adminUsersRoute.deleteUser);

adminRoute.get("/users/:userId/factors", adminUsersRoute.userFactors);
adminRoute.put("/users/:userId/factors/:factorId", adminUsersRoute.updateUserFactors);
adminRoute.delete("/users/:userId/factors/:factorId", adminUsersRoute.deleteUserFactors);

adminRoute.get("/sso/providers", adminSSORoute.listSSOProviders);
adminRoute.post("/sso/providers", adminSSORoute.registerSSSOProvider);
adminRoute.get("/sso/providers/:ssoProviderId", adminSSORoute.getSSOProviderDetails);
adminRoute.put("/sso/providers/:ssoProviderId", adminSSORoute.updateSSOProvider);
adminRoute.delete("/sso/providers/:ssoProviderId", adminSSORoute.deleteSSOProvider);

// Merge the protected and admin routes
api.route("/", protectedRoute);
api.route("/", adminRoute);

export default api;
