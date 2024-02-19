// import { Database as SQLiteDatabase } from 'sqlite3/mod.ts';
import { Client as LibSQLClient, createClient } from 'npm:@libsql/client';
import { LibsqlDialect } from 'npm:@libsql/kysely-libsql';
import { ColumnType, Kysely } from 'npm:kysely';
import { SerializePlugin } from 'npm:kysely-plugin-serialize';

import { PasswordTable } from '@/model/schema/password.ts';
import { SessionTable } from '@/model/schema/session.ts';
import { UserTable } from '@/model/schema/user.ts';

import env from '@/config.ts';

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
  created_at: ColumnType<Date, number | null, never>;
  updated_at: ColumnType<Date, number | null, never>;
}

export interface WithSoftDeleteTimeStamp {
  deleted_at: ColumnType<Date, number | null, never>;
}

const DBClientConfig: { url: string; authToken?: string } = {
  url: env.DATABASE_URL,
  authToken: env.DATABASE_TOKEN,
};

// @ref: https://github.com/tursodatabase/libsql-client-ts/blob/main/packages/libsql-client/examples/sync.js
export const sqlClient: LibSQLClient = createClient({ ...DBClientConfig });

export const db: Kysely<Database> = new Kysely<Database>({
  dialect: new LibsqlDialect(DBClientConfig),
  log: env.NODE_ENV === 'development' ? ['error', 'query'] : ['error'],
  plugins: [
    new SerializePlugin(), // This plugin should be placed at the end of plugins array
  ],
});

export type KyselyDatabase = Kysely<Database>;
