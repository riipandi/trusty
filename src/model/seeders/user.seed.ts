import { Kysely } from "kysely";
import { Scrypt } from "oslo/password";
import { typeid } from "typeid-js";

import { Database } from "@/model/client";
import { InsertPassword, InsertUser } from "@/model/schema/user.schema";

export async function userSeeder(db: Kysely<Database>) {
  const prefix = "user";
  const newUsers: InsertUser[] = [
    {
      id: typeid(prefix).toString(),
      email: "admin@example.com",
      first_name: "Admin",
      last_name: "Sistem",
    },
    {
      id: typeid(prefix).toString(),
      email: "john@example.com",
      first_name: "John",
      last_name: "Doe",
    },
  ];

  await db.transaction().execute(async (trx) => {
    const encrypted_password = await new Scrypt().hash("Passw0rd");

    const users = await trx
      .insertInto("users")
      .values(newUsers)
      .returning(["id", "email"])
      .execute();

    const usersPassword: InsertPassword[] = users.map(({ id: user_id }) => ({
      user_id,
      encrypted_password,
    }));

    return await trx.insertInto("passwords").values(usersPassword).execute();
  });
}
