import type { KyselyDatabase } from "@/model/client";
import { PRIMARY_KEY_COLUMN, TIMESTAMPS_COLUMN, TIMESTAMP_MS } from "@/model/extends";
import { type TableIndexBuilder, createIndex } from "@/model/extends";

import * as tAuditLog from "@/model/schema/audit_log.schema";
import * as tIdentities from "@/model/schema/identities.schema";
import * as tPassword from "@/model/schema/password.schema";
import * as tRefreshToken from "@/model/schema/refresh_token.schema";
import * as tSession from "@/model/schema/session.schema";
import * as tUser from "@/model/schema/user.schema";

//----------------------------------------------------------------------------
// Query to create `users` table
//----------------------------------------------------------------------------
export const UserMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tUser.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn("aud", "text")
    .addColumn("role", "text")
    .addColumn("email", "text", (col) => col.unique().notNull())
    .addColumn("email_change_token_new", "text")
    .addColumn("email_change", "text")
    .addColumn("email_change_token_current", "text")
    .addColumn("email_change_confirm_status", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("phone", "text", (col) => col.unique())
    .addColumn("phone_change", "text")
    .addColumn("phone_change_token", "text")
    .addColumn("raw_app_meta_data", "jsonb")
    .addColumn("raw_user_meta_data", "json")
    .addColumn("confirmation_token", "text")
    .addColumn("recovery_token", "text")
    .addColumn("reauthentication_token", "text")
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
    .ifNotExists();

export const UserTableIndexes: TableIndexBuilder[] = [
  {
    kind: "normal",
    name: "users_email_idx",
    column: "email",
  },
  {
    kind: "normal",
    name: "users_phone_idx",
    column: "phone",
  },
  {
    kind: "unique",
    name: "confirmation_token_idx",
    column: "confirmation_token",
    condition: "WHERE confirmation_token NOT LIKE '^[0-9 ]*$'",
  },
  {
    kind: "unique",
    name: "email_change_token_current_idx",
    column: "email_change_token_current",
    condition: "WHERE email_change_token_current NOT LIKE '^[0-9 ]*$'",
  },
  {
    kind: "unique",
    name: "email_change_token_new_idx",
    column: "email_change_token_new",
    condition: "WHERE email_change_token_new NOT LIKE '^[0-9 ]*$'",
  },
  {
    kind: "unique",
    name: "reauthentication_token_idx",
    column: "reauthentication_token",
    condition: "WHERE reauthentication_token NOT LIKE '^[0-9 ]*$'",
  },
  {
    kind: "unique",
    name: "recovery_token_idx",
    column: "recovery_token",
    condition: "WHERE recovery_token NOT LIKE '^[0-9 ]*$'",
  },
  {
    kind: "unique",
    name: "users_email_partial_key",
    column: "email",
    condition: "WHERE is_sso_user = 0",
  },
];

//----------------------------------------------------------------------------
// Query to create `passwords` table
//----------------------------------------------------------------------------
export const PasswordMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tPassword.TABLE_NAME)
    .addColumn("user_id", "text", (col) =>
      col.primaryKey().references("users.id").onDelete("no action"),
    )
    .addColumn("encrypted_password", "text", (col) => col.notNull())
    .addUniqueConstraint("passwords_user_id_unique", ["user_id", "encrypted_password"])
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists();

export const PasswordTableIndexes: TableIndexBuilder[] = [];

//----------------------------------------------------------------------------
// Query to create `sessions` table
//----------------------------------------------------------------------------
export const SessionMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tSession.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn("user_id", "text", (col) => col.references("users.id").onDelete("cascade").notNull())
    .addColumn("expires_at", "integer", (col) => col.notNull())
    .addColumn("created_at", "integer", (col) => col.defaultTo(TIMESTAMP_MS).notNull())
    .ifNotExists();

export const SessionsTableIndexes: TableIndexBuilder[] = [];

//----------------------------------------------------------------------------
// Query to create `refresh_tokens` table
//----------------------------------------------------------------------------
export const RefreshTokenMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tRefreshToken.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists();

export const RefreshTokenTableIndexes: TableIndexBuilder[] = [];

//----------------------------------------------------------------------------
// Query to create `identities` table
//----------------------------------------------------------------------------
export const IdentityMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tIdentities.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists();

export const IdentitiesTableIndexes: TableIndexBuilder[] = [];

//----------------------------------------------------------------------------
// Query to create `audit_log` table
//----------------------------------------------------------------------------
export const AuditLogMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tAuditLog.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists();

export const AuditLogTableIndexes: TableIndexBuilder[] = [];

export async function up(db: KyselyDatabase): Promise<void> {
  // Run `users` table migration
  await UserMigrationQuery(db).execute();
  await Promise.all(UserTableIndexes.map((index) => createIndex(db, tUser.TABLE_NAME, index)));

  // Run `passwords` table migration
  await PasswordMigrationQuery(db).execute();

  // Run `sessions` table migration
  await SessionMigrationQuery(db).execute();

  // Run `refresh_tokens` table migration
  await RefreshTokenMigrationQuery(db).execute();

  // Run `identities` table migration
  await IdentityMigrationQuery(db).execute();

  // Run `audit_log` table migration
  await AuditLogMigrationQuery(db).execute();
}

export async function down({ schema }: KyselyDatabase): Promise<void> {
  await Promise.all(
    // tAuditLog.TABLE_INDEXES.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
    // tIdentities.TABLE_INDEXES.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
    // tRefreshToken.TABLE_INDEXES.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
    // tSession.TABLE_INDEXES.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
    // tPassword.TABLE_INDEXES.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
    UserTableIndexes.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
  );
  await schema.dropTable(tAuditLog.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tIdentities.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tRefreshToken.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tSession.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tPassword.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tUser.TABLE_NAME).ifExists().execute();
}
