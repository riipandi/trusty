import type { KyselyDatabase } from "@/model/client";
import { PRIMARY_KEY_COLUMN, TIMESTAMPS_COLUMN } from "@/model/extends";

const FLOW_STATE_TABLE = "flow_state";
const SSO_PROVIDERS_TABLE = "sso_providers";
const SSO_DOMAINS_TABLE = "sso_domains";
const SAML_PROVIDERS_TABLE = "saml_providers";
const SAML_RELAY_STATES_TABLE = "saml_relay_states";

export async function up(db: KyselyDatabase): Promise<void> {
  //----------------------------------------------------------------------------
  // Query to create `flow_state` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(FLOW_STATE_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists()
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `sso_providers` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(SSO_PROVIDERS_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists()
    .execute();
  //----------------------------------------------------------------------------
  // Query to create `sso_domains` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(SSO_DOMAINS_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists()
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `saml_providers` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(SAML_PROVIDERS_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists()
    .execute();

  //----------------------------------------------------------------------------
  // Query to create `saml_relay_states` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(SAML_RELAY_STATES_TABLE)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists()
    .execute();
}

export async function down(db: KyselyDatabase): Promise<void> {
  await db.schema.dropTable(SAML_RELAY_STATES_TABLE).ifExists().execute();
  await db.schema.dropTable(SAML_PROVIDERS_TABLE).ifExists().execute();
  await db.schema.dropTable(SSO_DOMAINS_TABLE).ifExists().execute();
  await db.schema.dropTable(SSO_PROVIDERS_TABLE).ifExists().execute();
  await db.schema.dropTable(FLOW_STATE_TABLE).ifExists().execute();
}
