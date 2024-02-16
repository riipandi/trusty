import { sql } from "kysely";
import type { KyselyDatabase } from "@/model/client";
import {
  PRIMARY_KEY_COLUMN,
  TIMESTAMPS_COLUMN,
  TIMESTAMP_MS,
  TableIndexBuilder,
  createIndex,
} from "@/model/extends";

import * as tMfaAmrClaim from "@/model/schema/mfa_amr_claim";
import * as tMfaChallenge from "@/model/schema/mfa_challenge";
import * as tMfaFactor from "@/model/schema/mfa_factor";

//----------------------------------------------------------------------------
// Query to create `mfa_amr_claims` table
//----------------------------------------------------------------------------
const MfaAmrClaimMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tMfaAmrClaim.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn("session_id", "text", (col) =>
      col.references("sessions.id").onDelete("cascade").notNull(),
    )
    .addColumn("authentication_method", "text", (col) => col.notNull())
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists();

//----------------------------------------------------------------------------
// Query to create `mfa_challenges` table
//----------------------------------------------------------------------------
const MfaChallengeMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tMfaChallenge.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn("factor_id", "text", (col) =>
      col.references("factors.id").onDelete("cascade").notNull(),
    )
    .addColumn("ip_address", "integer")
    .addColumn("verified_at", "integer")
    .addColumn("created_at", "integer", (col) => col.defaultTo(TIMESTAMP_MS).notNull())
    .ifNotExists();

const MfaChallengeTableIndexes: TableIndexBuilder[] = [
  { kind: "normal", name: "mfa_challenge_created_at_idx", column: "created_at DESC" },
];

//----------------------------------------------------------------------------
// Query to create `mfa_factors` table
//----------------------------------------------------------------------------
const MfaFactorMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tMfaFactor.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn("user_id", "text", (col) => col.references("users.id").onDelete("cascade").notNull())
    .addColumn("friendly_name", "text")
    .addColumn("factor_type", "text", (c) => c.notNull().defaultTo("totp"))
    .addColumn("status", "text", (c) => c.notNull().defaultTo("unverified"))
    .addColumn("secret", "text")
    .$call(TIMESTAMPS_COLUMN)
    .addCheckConstraint("mfa_factors_factor_type_check", sql`factor_type IN ('totp','webauthn')`)
    .addCheckConstraint("mfa_factors_factor_status_check", sql`status IN ('unverified','verified')`)
    .ifNotExists();

const MfaFactorTableIndexes: TableIndexBuilder[] = [
  { kind: "normal", name: "factor_id_created_at_idx", column: "user_id, created_at" },
  {
    kind: "unique",
    name: "mfa_factors_user_friendly_name_unique",
    column: "friendly_name, user_id",
    condition: "WHERE trim(friendly_name) <> ''",
  },
  { kind: "normal", name: "mfa_factors_user_id_idx", column: "user_id" },
];

export async function up(db: KyselyDatabase): Promise<void> {
  // Run create tables migration
  await MfaAmrClaimMigrationQuery(db).execute();
  await MfaChallengeMigrationQuery(db).execute();
  await MfaFactorMigrationQuery(db).execute();

  // Run create indexes
  await Promise.all([
    MfaChallengeTableIndexes.map((index) => createIndex(db, tMfaChallenge.TABLE_NAME, index)),
    MfaFactorTableIndexes.map((index) => createIndex(db, tMfaFactor.TABLE_NAME, index)),
  ]);
}

export async function down({ schema }: KyselyDatabase): Promise<void> {
  await Promise.all([
    MfaChallengeTableIndexes.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
    MfaFactorTableIndexes.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
  ]);
  await schema.dropTable(tMfaFactor.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tMfaChallenge.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tMfaAmrClaim.TABLE_NAME).ifExists().execute();
}
