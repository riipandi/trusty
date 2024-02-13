import { Kysely } from "kysely";
import { Database } from "@/model/client";
import {
  PRIMARY_KEY_COLUMN,
  QueryCreateIndex,
  TIMESTAMPS_COLUMN,
  TIMESTAMP_MS,
  createUniqueIndex,
} from "@/model/extends";

const USERS_TABLE = "users";
const PASSWORDS_TABLE = "passwords";
const SESSIONS_TABLE = "sessions";
const REFRESH_TOKENS_TABLE = "refresh_tokens";
const IDENTITIES_TABLE = "identities";
const AUDIT_LOG_TABLE = "audit_log";

const USERS_UNIQUE_INDEXES: QueryCreateIndex[] = [
  {
    name: "confirmation_token_idx",
    column: "confirmation_token",
    condition: "WHERE confirmation_token NOT LIKE '^[0-9 ]*$'",
  },
  {
    name: "email_change_token_current_idx",
    column: "email_change_token_current",
    condition: "WHERE email_change_token_current NOT LIKE '^[0-9 ]*$'",
  },
  {
    name: "email_change_token_new_idx",
    column: "email_change_token_new",
    condition: "WHERE email_change_token_new NOT LIKE '^[0-9 ]*$'",
  },
  {
    name: "reauthentication_token_idx",
    column: "reauthentication_token",
    condition: "WHERE reauthentication_token NOT LIKE '^[0-9 ]*$'",
  },
  {
    name: "recovery_token_idx",
    column: "recovery_token",
    condition: "WHERE recovery_token NOT LIKE '^[0-9 ]*$'",
  },
  { name: "users_email_partial_key", column: "email", condition: "WHERE is_sso_user = 0" },
];

export async function up(db: Kysely<Database>): Promise<void> {
  //----------------------------------------------------------------------------
  // Query to create `users` table
  //----------------------------------------------------------------------------
  await db.schema
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
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex("users_email_index")
    .on(USERS_TABLE)
    .column("email")
    .ifNotExists()
    .execute();

  await Promise.all(USERS_UNIQUE_INDEXES.map((index) => createUniqueIndex(db, USERS_TABLE, index)));

  //----------------------------------------------------------------------------
  // Query to create `passwords` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(PASSWORDS_TABLE)
    .addColumn("user_id", "text", (col) =>
      col.primaryKey().references("users.id").onDelete("no action"),
    )
    .addColumn("encrypted_password", "text", (col) => col.notNull())
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists()
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `sessions` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(SESSIONS_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn("user_id", "text", (col) => col.references("users.id").onDelete("cascade").notNull())
    .addColumn("expires_at", "integer", (col) => col.notNull())
    .addColumn("created_at", "integer", (col) => col.defaultTo(TIMESTAMP_MS).notNull())
    .ifNotExists()
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `refresh_tokens` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(REFRESH_TOKENS_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists()
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `identities` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(IDENTITIES_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists()
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `audit_log` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(AUDIT_LOG_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await Promise.all(
    USERS_UNIQUE_INDEXES.map(({ name }) => db.schema.dropIndex(name).ifExists().execute()),
  );

  await db.schema.dropTable(AUDIT_LOG_TABLE).ifExists().execute();
  await db.schema.dropTable(IDENTITIES_TABLE).ifExists().execute();
  await db.schema.dropTable(REFRESH_TOKENS_TABLE).ifExists().execute();
  await db.schema.dropTable(SESSIONS_TABLE).ifExists().execute();
  await db.schema.dropTable(PASSWORDS_TABLE).ifExists().execute();
  await db.schema.dropTable(USERS_TABLE).ifExists().execute();
}
