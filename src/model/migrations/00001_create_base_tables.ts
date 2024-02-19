import { sql } from 'npm:kysely';
import type { KyselyDatabase } from '@/model/client.ts';
import {
  PRIMARY_KEY_COLUMN,
  SOFT_DELETED_COLUMN,
  TIMESTAMP_MS,
  TIMESTAMPS_COLUMN,
} from '@/model/extends.ts';
import { createIndex, type TableIndexBuilder } from '@/model/extends.ts';

import * as tAuditLog from '@/model/schema/audit_log.ts';
import * as tIdentities from '@/model/schema/identities.ts';
import * as tPassword from '@/model/schema/password.ts';
import * as tRefreshToken from '@/model/schema/refresh_token.ts';
import * as tSession from '@/model/schema/session.ts';
import * as tUser from '@/model/schema/user.ts';

//----------------------------------------------------------------------------
// Query to create `users` table
//----------------------------------------------------------------------------
const UserMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tUser.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn('aud', 'text')
    .addColumn('role', 'text')
    .addColumn('email', 'text', (col) => col.unique().notNull())
    .addColumn('email_change', 'text')
    .addColumn('email_change_token_new', 'text')
    .addColumn('email_change_token_current', 'text')
    .addColumn('email_change_confirm_status', 'integer', (col) => col.defaultTo(0))
    .addColumn('phone', 'text', (col) => col.unique())
    .addColumn('phone_change', 'text')
    .addColumn('phone_change_token', 'text')
    .addColumn('raw_app_meta_data', 'jsonb')
    .addColumn('raw_user_meta_data', 'jsonb')
    .addColumn('confirmation_token', 'text')
    .addColumn('recovery_token', 'text')
    .addColumn('reauthentication_token', 'text')
    .addColumn('is_super_admin', 'integer', (col) => col.defaultTo(0)) // boolean
    .addColumn('is_sso_user', 'integer', (col) => col.defaultTo(0)) // boolean
    .addColumn('last_sign_in_at', 'integer')
    .addColumn('banned_until', 'integer')
    .addColumn('invited_at', 'integer')
    .addColumn('email_confirmed_at', 'integer')
    .addColumn('email_change_sent_at', 'integer')
    .addColumn('phone_confirmed_at', 'integer')
    .addColumn('phone_change_sent_at', 'integer')
    .addColumn('confirmation_sent_at', 'integer')
    .addColumn('recovery_sent_at', 'integer')
    .addColumn('reauthentication_sent_at', 'integer')
    .addColumn('confirmed_at', 'integer')
    .$call(TIMESTAMPS_COLUMN)
    .$call(SOFT_DELETED_COLUMN)
    .ifNotExists();

const UserTableIndexes: TableIndexBuilder[] = [
  { kind: 'normal', name: 'users_email_idx', column: 'email' },
  { kind: 'normal', name: 'users_phone_idx', column: 'phone' },
  {
    kind: 'unique',
    name: 'confirmation_token_idx',
    column: 'confirmation_token',
    condition: "WHERE confirmation_token GLOB '*[^0-9 ]*'",
  },
  {
    kind: 'unique',
    name: 'email_change_token_current_idx',
    column: 'email_change_token_current',
    condition: "WHERE email_change_token_current GLOB '*[^0-9 ]*'",
  },
  {
    kind: 'unique',
    name: 'email_change_token_new_idx',
    column: 'email_change_token_new',
    condition: "WHERE email_change_token_new GLOB '*[^0-9 ]*'",
  },
  {
    kind: 'unique',
    name: 'reauthentication_token_idx',
    column: 'reauthentication_token',
    condition: "WHERE reauthentication_token GLOB '*[^0-9 ]*'",
  },
  {
    kind: 'unique',
    name: 'recovery_token_idx',
    column: 'recovery_token',
    condition: "WHERE recovery_token GLOB '*[^0-9 ]*'",
  },
  {
    kind: 'unique',
    name: 'users_email_partial_key',
    column: 'email',
    condition: 'WHERE is_sso_user = 0',
  },
];

//----------------------------------------------------------------------------
// Query to create `passwords` table
//----------------------------------------------------------------------------
const PasswordMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tPassword.TABLE_NAME)
    .addColumn('user_id', 'text', (col) =>
      col.primaryKey().references('users.id').onDelete('no action'))
    .addColumn('encrypted_password', 'text', (col) =>
      col.notNull())
    .addUniqueConstraint('passwords_user_id_unique', [
      'user_id',
      'encrypted_password',
    ])
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists();

//----------------------------------------------------------------------------
// Query to create `sessions` table
//----------------------------------------------------------------------------
const SessionMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tSession.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn('user_id', 'text', (col) => col.references('users.id').onDelete('cascade').notNull())
    .addColumn('factor_id', 'integer', (col) =>
      col.references('factors.id').onDelete('cascade').notNull())
    .addColumn('aal', 'text', (c) =>
      c.notNull().defaultTo('aal1'))
    .addColumn('not_after', 'integer')
    .addColumn('user_agent', 'text')
    .addColumn('ip', 'text')
    .addColumn('tag', 'text')
    .addColumn('refreshed_at', 'integer')
    .$call(TIMESTAMPS_COLUMN)
    .addCheckConstraint(
      'sessions_all_level_check',
      sql`aal IN ('aal1','aal2','aal3')`,
    )
    .ifNotExists();

const SessionsTableIndexes: TableIndexBuilder[] = [
  { kind: 'normal', name: 'sessions_not_after_idx', column: 'not_after DESC' },
  { kind: 'normal', name: 'sessions_user_id_idx', column: 'user_id' },
  {
    kind: 'normal',
    name: 'user_id_created_at_idx',
    column: 'user_id, created_at',
  },
];

//----------------------------------------------------------------------------
// Query to create `refresh_tokens` table
//----------------------------------------------------------------------------
const RefreshTokenMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tRefreshToken.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn('session_id', 'text', (col) =>
      col.references('sessions.id').onDelete('cascade').notNull())
    .addColumn('user_id', 'text', (col) =>
      col.references('users.id').onDelete('cascade').notNull())
    .addColumn('token', 'text')
    .addColumn('revoked', 'integer', (col) =>
      col.defaultTo(0).notNull()) // boolean
    .addColumn('parent', 'text')
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists();

const RefreshTokenTableIndexes: TableIndexBuilder[] = [
  { kind: 'unique', name: 'refresh_tokens_token_unique', column: 'token' },
  { kind: 'normal', name: 'refresh_token_session_id', column: 'session_id' },
  { kind: 'normal', name: 'refresh_tokens_parent_idx', column: 'parent' },
  {
    kind: 'normal',
    name: 'refresh_tokens_session_id_revoked_idx',
    column: 'session_id, revoked',
  },
  {
    kind: 'normal',
    name: 'refresh_tokens_updated_at_idx',
    column: 'updated_at DESC',
  },
];

//----------------------------------------------------------------------------
// Query to create `identities` table
//----------------------------------------------------------------------------
const IdentityMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tIdentities.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn('provider_id', 'text', (col) => col.notNull())
    .addColumn('user_id', 'text', (col) => col.notNull())
    .addColumn('email', 'text')
    .addColumn('identity_data', 'jsonb', (col) => col.notNull())
    .addColumn('provider', 'text', (col) => col.notNull())
    .addColumn('last_sign_in_at', 'integer')
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists();

const IdentitiesTableIndexes: TableIndexBuilder[] = [
  {
    kind: 'unique',
    name: 'identities_provider_id_provider_unique',
    column: 'provider_id, provider',
  },
  { kind: 'normal', name: 'identities_email_idx', column: 'email' },
  { kind: 'normal', name: 'identities_user_id_idx', column: 'user_id' },
];

//----------------------------------------------------------------------------
// Query to create `audit_log` table
//----------------------------------------------------------------------------
const AuditLogMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tAuditLog.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn('payload', 'jsonb', (col) => col.notNull())
    .addColumn('ip_address', 'text')
    .addColumn('created_at', 'integer', (col) => col.defaultTo(TIMESTAMP_MS).notNull())
    .ifNotExists();

export async function up(db: KyselyDatabase): Promise<void> {
  // Run create tables migration
  await UserMigrationQuery(db).execute();
  await PasswordMigrationQuery(db).execute();
  await SessionMigrationQuery(db).execute();
  await RefreshTokenMigrationQuery(db).execute();
  await IdentityMigrationQuery(db).execute();
  await AuditLogMigrationQuery(db).execute();

  // Run create indexes
  await Promise.all([
    UserTableIndexes.map((index) => createIndex(db, tUser.TABLE_NAME, index)),
    SessionsTableIndexes.map((index) => createIndex(db, tSession.TABLE_NAME, index)),
    RefreshTokenTableIndexes.map((index) => createIndex(db, tRefreshToken.TABLE_NAME, index)),
    IdentitiesTableIndexes.map((index) => createIndex(db, tIdentities.TABLE_NAME, index)),
  ]);
}

export async function down({ schema }: KyselyDatabase): Promise<void> {
  await Promise.all([
    IdentitiesTableIndexes.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
    RefreshTokenTableIndexes.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
    SessionsTableIndexes.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
    UserTableIndexes.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
  ]);
  await schema.dropTable(tAuditLog.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tIdentities.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tRefreshToken.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tSession.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tPassword.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tUser.TABLE_NAME).ifExists().execute();
}
