import { createClient } from "@libsql/client";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { ColumnType, Kysely } from "kysely";

import { SessionTable } from "@/model/schema/session.schema";
import { PasswordTable, UserTable } from "@/model/schema/user.schema";

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

export interface WithSoftDeleteSchema {
  deleted_at: ColumnType<Date, number | undefined, never>;
}

export const db = new Kysely<Database>({
  dialect: new LibsqlDialect({
    url: env.LIBSQL_CLIENT_URL,
    authToken: env.LIBSQL_CLIENT_TOKEN,
  }),
  log: env.NODE_ENV === "development" ? ["error", "query"] : ["error"],
});

export const libsqlClient = createClient({
  url: env.LIBSQL_CLIENT_URL,
  authToken: env.LIBSQL_CLIENT_TOKEN,
});
