import { Database } from "@/model/client";
import { addPrimaryKeyUuidColumn, addTimeStampColumns, timestampMs } from "@/model/extends";
import { Kysely } from "kysely";

const FLOW_STATE_TABLE = "flow_state";
const SSO_PROVIDERS_TABLE = "sso_providers";
const SSO_DOMAINS_TABLE = "sso_domains";
const SAML_PROVIDERS_TABLE = "saml_providers";
const SAML_RELAY_STATES_TABLE = "saml_relay_states";

export async function up(db: Kysely<Database>): Promise<void> {
  //----------------------------------------------------------------------------
  // Query to create `flow_state` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(FLOW_STATE_TABLE)
    .$call(addPrimaryKeyUuidColumn)
    .$call(addTimeStampColumns)
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `sso_providers` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(SSO_PROVIDERS_TABLE)
    .$call(addPrimaryKeyUuidColumn)
    .$call(addTimeStampColumns)
    .execute();
  //----------------------------------------------------------------------------
  // Query to create `sso_domains` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(SSO_DOMAINS_TABLE)
    .$call(addPrimaryKeyUuidColumn)
    .$call(addTimeStampColumns)
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `saml_providers` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(SAML_PROVIDERS_TABLE)
    .$call(addPrimaryKeyUuidColumn)
    .$call(addTimeStampColumns)
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `saml_relay_states` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(SAML_RELAY_STATES_TABLE)
    .$call(addPrimaryKeyUuidColumn)
    .$call(addTimeStampColumns)
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable(SAML_RELAY_STATES_TABLE).execute();
  await db.schema.dropTable(SAML_PROVIDERS_TABLE).execute();
  await db.schema.dropTable(SSO_DOMAINS_TABLE).execute();
  await db.schema.dropTable(SSO_PROVIDERS_TABLE).execute();
  await db.schema.dropTable(FLOW_STATE_TABLE).execute();
}
