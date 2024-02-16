import type { KyselyDatabase } from "@/model/client";
import { User } from "@/model/schema/user";

export async function findAllUsers(db: KyselyDatabase): Promise<User[] | null> {
  const users = await db.selectFrom("users").selectAll().execute();
  return users.length > 0 ? users : null;
}

export async function findUserById(db: KyselyDatabase, id: string): Promise<User | null> {
  const user = await db.selectFrom("users").where("id", "=", id).selectAll().executeTakeFirst();
  return user ?? null;
}

export async function findUserByEmail(db: KyselyDatabase, email: string): Promise<User | null> {
  const user = await db
    .selectFrom("users")
    .where("email", "=", email)
    .selectAll()
    .executeTakeFirst();
  return user ?? null;
}

export async function isExistsByEmail(db: KyselyDatabase, email: string): Promise<boolean> {
  const user = await findUserByEmail(db, email);
  return user !== null;
}

export async function isExistsById(db: KyselyDatabase, id: string): Promise<boolean> {
  const user = await findUserById(db, id);
  return user !== null;
}

export async function userPassword(db: KyselyDatabase, userId: string): Promise<boolean> {
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

export async function findUserPassword(db: KyselyDatabase, userId: string): Promise<string | null> {
  const password = await db
    .selectFrom("passwords")
    .where("user_id", "=", userId)
    .selectAll()
    .executeTakeFirst();

  return password?.encrypted_password ?? null;
}
