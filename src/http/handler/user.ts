import { Context } from "hono";
import { jsonResponse, throwResponse } from "@/http/response";
import { JwtPayload } from "@/http/middleware/jwt";
import * as userRepo from "@/model/repository/user.repo";

export async function getUsers(c: Context) {
  const users = await userRepo.findAllUsers(c.var.db);

  return !users
    ? throwResponse(c, 201, "No data")
    : jsonResponse(c, "Fetch a listing of users", { data: users });
}

export async function getUserById(c: Context) {
  const id = c.req.param("id");
  const user = await userRepo.findUserById(c.var.db, id);

  return !user
    ? throwResponse(c, 201, "No user found")
    : jsonResponse(c, "Fetch user account data for a user", { data: user });
}

export async function userInfo(c: Context) {
  const jwtPayload = c.get("jwtPayload") as JwtPayload;
  console.info("jwtPayload", jwtPayload);

  if (!jwtPayload) {
    return throwResponse(c, 201, "No data");
  }

  const payload = {
    remoteAddress: c.env.incoming.socket.remoteAddress,
    userAgent: c.req.header("User-Agent"),
    jwt: jwtPayload,
  };

  return jsonResponse(c, "Fetch the latest user account information", payload);
}

export async function updateUser(c: Context) {
  return jsonResponse(c, "Update certain properties of the current user account");
}

export async function reauthenticate(c: Context) {
  return jsonResponse(
    c,
    "Reauthenticates the possession of an email or phone number for the purpose of password change",
  );
}

export async function mfaEnroll(c: Context) {
  return jsonResponse(c, "Begin enrolling a new factor for mfa");
}

export async function createMfaChallenge(c: Context) {
  return jsonResponse(c, "Create a new challenge for a mfa factor");
}

export async function verifyMfaChallenge(c: Context) {
  return jsonResponse(c, "Verify a challenge on a factor");
}

export async function removeMfaFactor(c: Context) {
  return jsonResponse(c, "Remove a mfa factor from a user");
}
