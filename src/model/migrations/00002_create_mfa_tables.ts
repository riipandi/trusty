import { Database } from "@/model/client";
import { addPrimaryKeyUuidColumn, addTimeStampColumns } from "@/model/extends";
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
    .$call(addPrimaryKeyUuidColumn)
    .$call(addTimeStampColumns)
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `mfa_challenges` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(MFA_CHALLENGES_TABLE)
    .$call(addPrimaryKeyUuidColumn)
    .$call(addTimeStampColumns)
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `mfa_factors` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(MFA_FACTORS_TABLE)
    .$call(addPrimaryKeyUuidColumn)
    .$call(addTimeStampColumns)
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable(MFA_FACTORS_TABLE).execute();
  await db.schema.dropTable(MFA_CHALLENGES_TABLE).execute();
  await db.schema.dropTable(MFA_AMR_CLAIMS_TABLE).execute();
}
