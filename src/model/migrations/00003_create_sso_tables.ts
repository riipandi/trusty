import type { KyselyDatabase } from "@/model/client";
import { PRIMARY_KEY_COLUMN, TIMESTAMPS_COLUMN } from "@/model/extends";

import * as tFlowState from "@/model/schema/flow_state";
import * as tSamlProvider from "@/model/schema/saml_provider";
import * as tSamlRelayState from "@/model/schema/saml_relay_state";
import * as tSSODomain from "@/model/schema/sso_domain";
import * as tSSOProvider from "@/model/schema/sso_provider";

export async function up(db: KyselyDatabase): Promise<void> {
  //----------------------------------------------------------------------------
  // Query to create `flow_state` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(tFlowState.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    // id TEXT PRIMARY KEY NOT NULL,
    // user_id TEXT,
    // auth_code TEXT NOT NULL,
    // code_challenge_method TEXT CHECK ( code_challenge_method IN ('s256','plain') ) NOT NULL DEFAULT 'plain', -- ENUM code_challenge_method
    // code_challenge TEXT NOT NULL,
    // provider_type TEXT NOT NULL,
    // provider_access_token TEXT,
    // provider_refresh_token TEXT,
    // authentication_method TEXT NOT NULL,
    // created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    // updated_at INTEGER,
    // FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    .ifNotExists()
    .execute();

  // CREATE INDEX IF NOT EXISTS flow_state_created_at_idx ON flow_state (created_at DESC);
  // CREATE INDEX IF NOT EXISTS idx_auth_code ON flow_state (auth_code);
  // CREATE INDEX IF NOT EXISTS idx_user_id_auth_method ON flow_state (user_id, authentication_method);

  //----------------------------------------------------------------------------
  // Query to create `sso_providers` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(tSSOProvider.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    // id TEXT PRIMARY KEY NOT NULL,
    // resource_id TEXT,
    // created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    // updated_at INTEGER,
    // CHECK (resource_id IS NULL OR length(resource_id) > 0)
    .ifNotExists()
    .execute();

  // CREATE UNIQUE INDEX sso_providers_resource_id_idx ON sso_providers (lower(resource_id));

  //----------------------------------------------------------------------------
  // Query to create `sso_domains` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(tSSODomain.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    // id TEXT PRIMARY KEY NOT NULL,
    // sso_provider_id TEXT NOT NULL,
    // domain TEXT NOT NULL,
    // created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    // updated_at INTEGER,
    // FOREIGN KEY (sso_provider_id) REFERENCES sso_providers (id) ON DELETE CASCADE,
    // CHECK (length(domain) > 0)
    .ifNotExists()
    .execute();

  // CREATE UNIQUE INDEX sso_domains_domain_idx ON sso_domains (lower(domain));
  // CREATE INDEX IF NOT EXISTS sso_domains_sso_provider_id_idx ON sso_domains (sso_provider_id);

  //----------------------------------------------------------------------------
  // Query to create `saml_providers` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(tSamlProvider.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    // id TEXT PRIMARY KEY NOT NULL,
    // sso_provider_id TEXT NOT NULL,
    // entity_id TEXT NOT NULL,
    // metadata_xml TEXT NOT NULL,
    // metadata_url TEXT,
    // attribute_mapping JSON,
    // created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    // updated_at INTEGER,
    // FOREIGN KEY (sso_provider_id) REFERENCES sso_providers (id) ON DELETE CASCADE,
    // CHECK (length(entity_id) > 0),
    // CHECK (metadata_url IS NULL OR length(metadata_url) > 0),
    // CHECK (length(metadata_xml) > 0),
    // UNIQUE (entity_id)
    .ifNotExists()
    .execute();

  // CREATE INDEX IF NOT EXISTS saml_providers_sso_provider_id_idx ON saml_providers (sso_provider_id);

  //----------------------------------------------------------------------------
  // Query to create `saml_relay_states` table
  //----------------------------------------------------------------------------
  await db.schema
    .createTable(tSamlRelayState.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    // id TEXT PRIMARY KEY NOT NULL,
    // sso_provider_id TEXT NOT NULL,
    // flow_state_id TEXT,
    // request_id TEXT NOT NULL,
    // for_email TEXT,
    // redirect_to TEXT,
    // created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    // updated_at INTEGER,
    // FOREIGN KEY (sso_provider_id) REFERENCES sso_providers (id) ON DELETE CASCADE,
    // FOREIGN KEY (flow_state_id) REFERENCES flow_state (id) ON DELETE CASCADE,
    // CHECK (length(request_id) > 0)
    .ifNotExists()
    .execute();

  // CREATE INDEX IF NOT EXISTS saml_relay_states_created_at_idx ON saml_relay_states (created_at DESC);
  // CREATE INDEX IF NOT EXISTS saml_relay_states_for_email_idx ON saml_relay_states (for_email);
  // CREATE INDEX IF NOT EXISTS saml_relay_states_sso_provider_id_idx ON saml_relay_states (sso_provider_id);
}

export async function down(db: KyselyDatabase): Promise<void> {
  await db.schema.dropTable(tSamlRelayState.TABLE_NAME).ifExists().execute();
  await db.schema.dropTable(tSamlProvider.TABLE_NAME).ifExists().execute();
  await db.schema.dropTable(tSSODomain.TABLE_NAME).ifExists().execute();
  await db.schema.dropTable(tSSOProvider.TABLE_NAME).ifExists().execute();
  await db.schema.dropTable(tFlowState.TABLE_NAME).ifExists().execute();
}
