import { Context } from "hono";
import { db } from "@/model/client";
import { jsonResponse, throwResponse } from "@/http/response";
import * as userRepo from "@/model/repository/user.repo";

export async function getUsers(c: Context) {
  const users = await userRepo.findAllUsers(db);

  if (!users) {
    return throwResponse(c, 201, "No data");
  }

  return jsonResponse(c, undefined, { data: users });
}

export async function getUserById(c: Context) {
  const id = c.req.param("id");
  const user = await userRepo.findUserById(db, id);

  if (!user) {
    return throwResponse(c, 201, "No user found");
  }

  return jsonResponse(c, undefined, { data: user });
}
