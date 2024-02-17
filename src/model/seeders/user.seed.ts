import { Argon2id } from "oslo/password";
import { faker } from "@faker-js/faker";
import { typeid } from "typeid-js";

import { type KyselyDatabase } from "@/model/client";
import { InsertUser } from "@/model/schema/user";

export async function userSeeder(db: KyselyDatabase) {
  try {
    const defaultUsers: { user: InsertUser; password: string }[] = [
      {
        user: {
          // id: typeid("user").toString(),
          email: "admin@example.com",
          aud: "authenticated",
          role: "authenticated",
          email_confirmed_at: null,
          invited_at: null,
          confirmation_token: "",
          confirmation_sent_at: null,
          recovery_token: "",
          recovery_sent_at: null,
          email_change_token_new: "",
          email_change: "",
          email_change_sent_at: null,
          last_sign_in_at: null,
          raw_app_meta_data: {
            provider: "google",
            providers: ["google"],
          },
          raw_user_meta_data: {
            iss: "https://www.googleapis.com/userinfo/v2/me",
            sub: "123456789098765432100",
            name: "Admin Sistem",
            email: "admin@example.com",
            picture: "https://api.dicebear.com/7.x/adventurer/svg?seed=Abby",
            full_name: "Admin Sistem",
            avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Abby",
            provider_id: "123456789098765432100",
            email_verified: true,
          },
          is_super_admin: true,
          updated_at: null,
          phone: null,
          phone_confirmed_at: null,
          phone_change: "",
          phone_change_token: "",
          phone_change_sent_at: null,
          confirmed_at: null,
          email_change_token_current: "",
          email_change_confirm_status: 0,
          banned_until: null,
          reauthentication_token: "",
          reauthentication_sent_at: null,
          is_sso_user: false,
          deleted_at: null,
        },
        password: "adminPassword",
      },
      {
        user: {
          // id: typeid("user").toString(),
          email: "john@example.com",
          aud: "authenticated",
          role: "authenticated",
          email_confirmed_at: null,
          invited_at: null,
          confirmation_token: "",
          confirmation_sent_at: null,
          recovery_token: "511bf0cbc4b25c40bc72ee244e6a19de800a262f",
          recovery_sent_at: null,
          email_change_token_new: "",
          email_change: "",
          email_change_sent_at: null,
          last_sign_in_at: null,
          raw_app_meta_data: {
            provider: "email",
            providers: ["email", "github"],
          },
          raw_user_meta_data: {
            iss: "https://api.github.com",
            sub: "123456",
            name: "John Doe",
            email: "john@example.com",
            full_name: "John Doe",
            user_name: "riipandi",
            avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Midnight",
            provider_id: "123456",
            email_verified: true,
            preferred_username: "johndoe",
          },
          is_super_admin: false,
          phone: null,
          phone_confirmed_at: null,
          phone_change: "",
          phone_change_token: "",
          phone_change_sent_at: null,
          confirmed_at: null,
          email_change_token_current: "",
          email_change_confirm_status: 0,
          banned_until: null,
          reauthentication_token: "",
          reauthentication_sent_at: null,
          is_sso_user: false,
          deleted_at: null,
        },
        password: "johnPassword",
      },
    ];

    // Generate fake users with passwords
    const fakeUsers: { user: InsertUser; password: string }[] = [];
    for (let i = 0; i < 100; i++) {
      fakeUsers.push({
        user: {
          email: faker.internet.email().toLocaleLowerCase(),
          aud: "authenticated",
          role: "authenticated",
          is_super_admin: false,
        },
        password: faker.internet.password(),
      });
    }

    const usersWithPasswords = [...defaultUsers, ...fakeUsers];

    await db.transaction().execute(async (trx) => {
      const passwordHasher = new Argon2id();

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
