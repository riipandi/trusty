import { Database } from "@/model/client";
import { addPrimaryKeyUuidColumn, addTimeStampColumns, timestampMs } from "@/model/extends";
import { Kysely } from "kysely";

const USERS_TABLE = "users";
const PASSWORDS_TABLE = "passwords";
const SESSIONS_TABLE = "sessions";
const REFRESH_TOKENS_TABLE = "refresh_tokens";
const IDENTITIES_TABLE = "identities";
const AUDIT_LOG_TABLE = "audit_log";

export async function up(db: Kysely<Database>): Promise<void> {
  //----------------------------------------------------------------------------
  // Query to create `users` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(USERS_TABLE)
    .$call(addPrimaryKeyUuidColumn)
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("first_name", "text", (col) => col.notNull())
    .addColumn("last_name", "text", (col) => col.notNull())
    .$call(addTimeStampColumns)
    .execute();

  await db.schema.createIndex("users_email_index").on(USERS_TABLE).column("email").execute();

  //----------------------------------------------------------------------------
  // Query to create `passwords` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(PASSWORDS_TABLE)
    .addColumn("user_id", "text", (col) =>
      col.references("users.id").onDelete("no action").notNull().unique(),
    )
    .addColumn("encrypted_password", "text", (col) => col.notNull())
    .$call(addTimeStampColumns)
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `sessions` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(SESSIONS_TABLE)
    .$call(addPrimaryKeyUuidColumn)
    .addColumn("user_id", "text", (col) => col.references("users.id").onDelete("cascade").notNull())
    .addColumn("expires_at", "integer", (col) => col.notNull())
    .addColumn("created_at", "integer", (col) => col.defaultTo(timestampMs).notNull())
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `refresh_tokens` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(REFRESH_TOKENS_TABLE)
    .$call(addPrimaryKeyUuidColumn)
    .$call(addTimeStampColumns)
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `identities` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(IDENTITIES_TABLE)
    .$call(addPrimaryKeyUuidColumn)
    .$call(addTimeStampColumns)
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `audit_log` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(AUDIT_LOG_TABLE)
    .$call(addPrimaryKeyUuidColumn)
    .$call(addTimeStampColumns)
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable(AUDIT_LOG_TABLE).execute();
  await db.schema.dropTable(IDENTITIES_TABLE).execute();
  await db.schema.dropTable(REFRESH_TOKENS_TABLE).execute();
  await db.schema.dropTable(SESSIONS_TABLE).execute();
  await db.schema.dropTable(PASSWORDS_TABLE).execute();
  await db.schema.dropTable(USERS_TABLE).execute();
}
