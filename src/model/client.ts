import { Client as LibSQLClient, createClient } from "@libsql/client";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { ColumnType, Kysely } from "kysely";

import { PasswordTable } from "@/model/schema/password";
import { SessionTable } from "@/model/schema/session";
import { UserTable } from "@/model/schema/user";

import env from "@/config";

/**
 * For Kysely's type-safety and autocompletion to work, it needs to know
 * your database structure. This requires a TypeScript Database interface,
 * that contains table names as keys and table schema interfaces as values.
 *
 * If the column is nullable in the database, make its type nullable.
 * Don't use optional properties. Optionality is always determined
 * automatically by Kysely.
 */
export interface Database {
  users: UserTable;
  passwords: PasswordTable;
  sessions: SessionTable;
}

export interface WithTimeStampSchema {
  created_at: ColumnType<Date, number | undefined, never>;
  updated_at: ColumnType<Date, number | undefined, never>;
}

export const db: Kysely<Database> = new Kysely<Database>({
  dialect: new LibsqlDialect({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_TOKEN,
  }),
  log: env.NODE_ENV === "development" ? ["error", "query"] : ["error"],
});

export const sqlc: LibSQLClient = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_TOKEN,
  // @ref: https://github.com/tursodatabase/libsql-client-ts/blob/main/packages/libsql-client/examples/sync.js
  // syncUrl: env.DATABASE_URL, // Sync mode
});

export type KyselyDatabase = Kysely<Database>;
