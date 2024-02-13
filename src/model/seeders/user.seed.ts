import { Scrypt } from "oslo/password";
import { typeid } from "typeid-js";

import { type KyselyDatabase } from "@/model/client";
import { InsertUser } from "@/model/schema/user.schema";

export async function userSeeder(db: KyselyDatabase) {
  try {
    const usersWithPasswords: { user: InsertUser; password: string }[] = [
      {
        user: {
          id: typeid("user").toString(),
          email: "admin@example.com",
          is_super_admin: true,
        },
        password: "adminPassword",
      },
      {
        user: {
          id: typeid("user").toString(),
          email: "john@example.com",
          is_super_admin: false,
        },
        password: "johnPassword",
      },
    ];

    await db.transaction().execute(async (trx) => {
      const passwordHasher = new Scrypt();

      const newUsers = await trx
        .insertInto("users")
        .values(usersWithPasswords.map(({ user }) => user))
        .returning(["id", "email"])
        .execute();

      const passwordPromises = newUsers.map(async ({ id: user_id, email }) => {
        const userWithPassword = usersWithPasswords.find((u) => u.user.email === email);
        if (!userWithPassword) {
          console.warn(`No password found for user with email '${email}'. Skipping.`);
          return; // Skip and continue to the next user
        }
        const { password } = userWithPassword;
        const encrypted_password = await passwordHasher.hash(password);
        return trx.insertInto("passwords").values({ user_id, encrypted_password }).execute();
      });

      return Promise.all(passwordPromises);
    });
  } catch (error) {
    console.error("Error occurred during user seeding:", error);
    throw error;
  }
}
