import { jsonResponse, throwResponse } from "@/http/response";
import * as userRepo from "@/model/repository/user.repo";
import { Context } from "hono";

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

export async function updateUser(c: Context) {
  return jsonResponse(c, "Update users account data");
}

export async function deleteUser(c: Context) {
  return jsonResponse(c, "Delete a user");
}

export async function userFactors(c: Context) {
  return jsonResponse(c, "List all of the mfa factors for a user");
}

export async function updateUserFactors(c: Context) {
  return jsonResponse(c, "Update a users mfa factor");
}

export async function deleteUserFactors(c: Context) {
  return jsonResponse(c, "Remove a users mfa factor");
}
