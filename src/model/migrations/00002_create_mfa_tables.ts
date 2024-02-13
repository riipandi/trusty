import { Database } from "@/model/client";
import { PRIMARY_KEY_COLUMN, TIMESTAMPS_COLUMN } from "@/model/extends";
import { Kysely } from "kysely";

const MFA_AMR_CLAIMS_TABLE = "mfa_amr_claims";
const MFA_CHALLENGES_TABLE = "mfa_challenges";
const MFA_FACTORS_TABLE = "mfa_factors";

export async function up(db: Kysely<Database>): Promise<void> {
  //----------------------------------------------------------------------------
  // Query to create `mfa_amr_claims` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(MFA_AMR_CLAIMS_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists()
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `mfa_challenges` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(MFA_CHALLENGES_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists()
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `mfa_factors` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(MFA_FACTORS_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable(MFA_FACTORS_TABLE).ifExists().execute();
  await db.schema.dropTable(MFA_CHALLENGES_TABLE).ifExists().execute();
  await db.schema.dropTable(MFA_AMR_CLAIMS_TABLE).ifExists().execute();
}
