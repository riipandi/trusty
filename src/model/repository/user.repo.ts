import type { DB } from "@/model/client";
import { User } from "@/model/schema/user.schema";

export async function findAllUsers(db: DB): Promise<User[] | null> {
  const users = await db.selectFrom("users").selectAll().execute();
  return users.length > 0 ? users : null;
}

export async function findUserById(db: DB, id: string): Promise<User | null> {
  const user = await db.selectFrom("users").where("id", "=", id).selectAll().executeTakeFirst();
  return user ?? null;
}

export async function findUserByEmail(db: DB, email: string): Promise<User | null> {
  const user = await db
    .selectFrom("users")
    .where("email", "=", email)
    .selectAll()
    .executeTakeFirst();
  return user ?? null;
}

export async function isExistsByEmail(db: DB, email: string): Promise<boolean> {
  const user = await findUserByEmail(db, email);
  return user !== null;
}

export async function isExistsById(db: DB, id: string): Promise<boolean> {
  const user = await findUserById(db, id);
  return user !== null;
}

export async function userPassword(db: DB, userId: string): Promise<boolean> {
  const user = await findUserById(db, userId);

  if (!user) {
    return false;
  }

  const password = await db
    .selectFrom("passwords")
    .where("user_id", "=", userId)
    .selectAll()
    .executeTakeFirst();

  return password !== null;
}

export async function findUserPassword(db: DB, userId: string): Promise<string | null> {
  const password = await db
    .selectFrom("passwords")
    .where("user_id", "=", userId)
    .selectAll()
    .executeTakeFirst();

  return password?.encrypted_password ?? null;
}
