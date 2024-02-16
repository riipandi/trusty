import { jsonResponse, throwResponse } from "@/http/response";
import { db } from "@/model/client";
import * as userRepo from "@/model/repository/user.repo";
import { Context } from "hono";

export async function getUsers(c: Context) {
  const users = await userRepo.findAllUsers(db);

  if (!users) {
    return throwResponse(c, 201, "No data");
  }

  return jsonResponse(c, "Fetch a listing of users", { data: users });
}

export async function getUserById(c: Context) {
  const id = c.req.param("id");
  const user = await userRepo.findUserById(db, id);

  if (!user) {
    return throwResponse(c, 201, "No user found");
  }

  return jsonResponse(c, "Fetch user account data for a user", { data: user });
}
