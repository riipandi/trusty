import { Database } from "@/model/client";
import { PRIMARY_KEY_COLUMN, TIMESTAMPS_COLUMN, TIMESTAMP_MS } from "@/model/extends";
import { Kysely } from "kysely";

const USERS_TABLE = "users";
const PASSWORDS_TABLE = "passwords";
const SESSIONS_TABLE = "sessions";
const REFRESH_TOKENS_TABLE = "refresh_tokens";
const IDENTITIES_TABLE = "identities";
const AUDIT_LOG_TABLE = "audit_log";

export async function up({ schema }: Kysely<Database>): Promise<void> {
  //----------------------------------------------------------------------------
  // Query to create `users` table
  //----------------------------------------------------------------------------
  await schema
    .createTable(USERS_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn("aud", "text")
    .addColumn("role", "text")
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("email_change_token_new", "text")
    .addColumn("email_change", "text")
    .addColumn("email_change_token_current", "text", (col) => col.defaultTo(""))
    .addColumn("email_change_confirm_status", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("phone", "text", (col) => col.unique())
    .addColumn("phone_change", "text", (col) => col.defaultTo(""))
    .addColumn("phone_change_token", "text", (col) => col.defaultTo(""))
    .addColumn("raw_app_meta_data", "jsonb")
    .addColumn("raw_user_meta_data", "json")
    .addColumn("confirmation_token", "text")
    .addColumn("recovery_token", "text")
    .addColumn("reauthentication_token", "text", (col) => col.defaultTo(""))
    .addColumn("is_super_admin", "integer", (col) => col.notNull().defaultTo(false))
    .addColumn("is_sso_user", "integer", (col) => col.notNull().defaultTo(false))
    .addColumn("last_sign_in_at", "integer")
    .addColumn("banned_until", "integer")
    .addColumn("invited_at", "integer")
    .addColumn("email_confirmed_at", "integer")
    .addColumn("email_change_sent_at", "integer")
    .addColumn("phone_confirmed_at", "integer")
    .addColumn("phone_change_sent_at", "integer")
    .addColumn("confirmation_sent_at", "integer")
    .addColumn("recovery_sent_at", "integer")
    .addColumn("reauthentication_sent_at", "integer")
    .addColumn("confirmed_at", "integer")
    .$call(TIMESTAMPS_COLUMN)
    .execute();

  await schema.createIndex("users_email_index").on(USERS_TABLE).column("email").execute();

  //----------------------------------------------------------------------------
  // Query to create `passwords` table
  //----------------------------------------------------------------------------
  await schema
    .createTable(PASSWORDS_TABLE)
    .addColumn("user_id", "text", (col) =>
      col.primaryKey().references("users.id").onDelete("no action"),
    )
    .addColumn("encrypted_password", "text", (col) => col.notNull())
    .$call(TIMESTAMPS_COLUMN)
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `sessions` table
  //----------------------------------------------------------------------------
  await schema
    .createTable(SESSIONS_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn("user_id", "text", (col) => col.references("users.id").onDelete("cascade").notNull())
    .addColumn("expires_at", "integer", (col) => col.notNull())
    .addColumn("created_at", "integer", (col) => col.defaultTo(TIMESTAMP_MS).notNull())
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `refresh_tokens` table
  //----------------------------------------------------------------------------
  await schema
    .createTable(REFRESH_TOKENS_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `identities` table
  //----------------------------------------------------------------------------
  await schema
    .createTable(IDENTITIES_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `audit_log` table
  //----------------------------------------------------------------------------
  await schema
    .createTable(AUDIT_LOG_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .execute();
}

export async function down({ schema }: Kysely<Database>): Promise<void> {
  await schema.dropTable(AUDIT_LOG_TABLE).execute();
  await schema.dropTable(IDENTITIES_TABLE).execute();
  await schema.dropTable(REFRESH_TOKENS_TABLE).execute();
  await schema.dropTable(SESSIONS_TABLE).execute();
  await schema.dropTable(PASSWORDS_TABLE).execute();
  await schema.dropTable(USERS_TABLE).execute();
}
