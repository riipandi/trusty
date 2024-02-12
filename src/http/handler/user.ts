import { JwtPayload } from "@/binding";
import { jsonResponse, throwResponse } from "@/http/response";
import { db } from "@/model/client";
import { consola } from "consola";
import { Context } from "hono";

export async function getUsers(c: Context) {
  const jwtPayload = c.get("jwtPayload") as JwtPayload;
  consola.info("jwtPayload", jwtPayload);

  const users = await db.selectFrom("users").selectAll().execute();

  if (users.length === 0) {
    return throwResponse(c, 201, "No data");
  }

  return jsonResponse(c, undefined, { data: users });
}

export async function getUserById(c: Context) {
  const id = c.req.param("id");
  const user = await db.selectFrom("users").where("id", "=", id).selectAll().executeTakeFirst();

  if (!user) {
    return throwResponse(c, 201, "No user found");
  }

  return jsonResponse(c, undefined, { data: user });
}
