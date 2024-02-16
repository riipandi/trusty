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
    // id TEXT PRIMARY KEY NOT NULL,
    // session_id TEXT NOT NULL,
    // authentication_method TEXT NOT NULL,
    // created_at TIMESTAMP NOT NULL,
    // updated_at TIMESTAMP NOT NULL,
    // FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
    .ifNotExists();

const MfaAmrClaimTableIndexes: TableIndexBuilder[] = [];

//----------------------------------------------------------------------------
// Query to create `mfa_challenges` table
//----------------------------------------------------------------------------
const MfaChallengeMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tMfaChallenge.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    // id TEXT PRIMARY KEY NOT NULL,
    // factor_id TEXT NOT NULL,
    // ip_address TEXT NOT NULL,
    // verified_at INTEGER,
    // created_at TIMESTAMP NOT NULL,
    // FOREIGN KEY (factor_id) REFERENCES mfa_factors (id) ON DELETE CASCADE
    .ifNotExists();

// CREATE INDEX IF NOT EXISTS mfa_challenge_created_at_idx ON mfa_challenges (created_at DESC);
const MfaChallengeTableIndexes: TableIndexBuilder[] = [];

//----------------------------------------------------------------------------
// Query to create `mfa_factors` table
//----------------------------------------------------------------------------
const MfaFactorMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tMfaFactor.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    // id TEXT PRIMARY KEY NOT NULL,
    // user_id TEXT NOT NULL,
    // friendly_name TEXT,
    // factor_type TEXT CHECK ( factor_type IN ('totp','webauthn') ) NOT NULL DEFAULT 'totp', -- ENUM factor_type
    // status TEXT CHECK ( status IN ('unverified','verified') ) NOT NULL DEFAULT 'unverified', -- ENUM factor_status
    // secret TEXT,
    // created_at TIMESTAMP NOT NULL,
    // updated_at TIMESTAMP NOT NULL,
    // FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    .ifNotExists();

// CREATE INDEX IF NOT EXISTS factor_id_created_at_idx ON mfa_factors (user_id, created_at);
// CREATE UNIQUE INDEX IF NOT EXISTS mfa_factors_user_friendly_name_unique ON mfa_factors (friendly_name, user_id) WHERE trim(friendly_name) <> '';
// CREATE INDEX IF NOT EXISTS mfa_factors_user_id_idx ON mfa_factors (user_id);
const MfaFactorTableIndexes: TableIndexBuilder[] = [];

export async function up(db: KyselyDatabase): Promise<void> {
  // Run create tables migration
  await MfaAmrClaimMigrationQuery(db).execute();
  await MfaChallengeMigrationQuery(db).execute();
  await MfaFactorMigrationQuery(db).execute();

  // Run create indexes
  await Promise.all([
    MfaAmrClaimTableIndexes.map((index) => createIndex(db, tMfaAmrClaim.TABLE_NAME, index)),
    MfaChallengeTableIndexes.map((index) => createIndex(db, tMfaChallenge.TABLE_NAME, index)),
    MfaFactorTableIndexes.map((index) => createIndex(db, tMfaFactor.TABLE_NAME, index)),
  ]);
}

export async function down(db: KyselyDatabase): Promise<void> {
  await db.schema.dropTable(tMfaFactor.TABLE_NAME).ifExists().execute();
  await db.schema.dropTable(tMfaChallenge.TABLE_NAME).ifExists().execute();
  await db.schema.dropTable(tMfaAmrClaim.TABLE_NAME).ifExists().execute();
}
