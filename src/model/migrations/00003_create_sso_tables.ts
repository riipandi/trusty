import type { KyselyDatabase } from "@/model/client";
import {
  PRIMARY_KEY_COLUMN,
  TIMESTAMPS_COLUMN,
  TableIndexBuilder,
  createIndex,
} from "@/model/extends";
import { sql } from "kysely";

import * as tFlowState from "@/model/schema/flow_state";
import * as tSamlProvider from "@/model/schema/saml_provider";
import * as tSamlRelayState from "@/model/schema/saml_relay_state";
import * as tSSODomain from "@/model/schema/sso_domain";
import * as tSSOProvider from "@/model/schema/sso_provider";

//----------------------------------------------------------------------------
// Query to create `flow_state` table
//----------------------------------------------------------------------------
const FlowStateMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tFlowState.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn("user_id", "text", (col) => col.references("users.id").onDelete("cascade").notNull())
    .addColumn("auth_code", "text", (col) => col.notNull())
    .addColumn("code_challenge_method", "text", (c) => c.notNull().defaultTo("plain"))
    .addColumn("code_challenge", "text", (col) => col.notNull())
    .addColumn("provider_type", "text", (col) => col.notNull())
    .addColumn("provider_access_token", "text")
    .addColumn("provider_refresh_token", "text")
    .addColumn("authentication_method", "text", (col) => col.notNull())
    .$call(TIMESTAMPS_COLUMN)
    .addCheckConstraint(
      "flow_state_code_challenge_method_check",
      sql`code_challenge_method IN ('s256','plain')`,
    )
    .ifNotExists();

const FlowStateTableIndexes: TableIndexBuilder[] = [
  { kind: "normal", name: "flow_state_created_at_idx", column: "created_at DESC" },
  { kind: "normal", name: "idx_auth_code", column: "auth_code" },
  { kind: "normal", name: "idx_user_id_auth_method", column: "user_id, authentication_method" },
];

//----------------------------------------------------------------------------
// Query to create `sso_providers` table
//----------------------------------------------------------------------------
const SSOProviderMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tSSOProvider.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn("resource_id", "text", (col) =>
      col.modifyEnd(sql`CHECK (resource_id IS NULL OR length(resource_id) > 0)`),
    )
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists();

const SSOProviderTableIndexes: TableIndexBuilder[] = [
  { kind: "unique", name: "sso_providers_resource_id_idx", column: "resource_id" },
];

//----------------------------------------------------------------------------
// Query to create `sso_domains` table
//----------------------------------------------------------------------------
const SSODomainMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tSSODomain.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn("sso_provider_id", "text", (col) =>
      col.references("sso_providers.id").onDelete("cascade").notNull(),
    )
    .addColumn("domain", "text", (col) => col.notNull())
    .$call(TIMESTAMPS_COLUMN)
    .addCheckConstraint("sso_domains_domain_length_check", sql`(length(domain) > 0)`)
    .ifNotExists();

const SSODomainTableIndexes: TableIndexBuilder[] = [
  { kind: "unique", name: "sso_domains_domain_idx", column: "domain" },
  { kind: "normal", name: "sso_domains_sso_provider_id_idx", column: "sso_provider_id" },
];

//----------------------------------------------------------------------------
// Query to create `saml_providers` table
//----------------------------------------------------------------------------
const SAMLProviderMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tSamlProvider.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn("sso_provider_id", "text", (col) =>
      col.references("sso_providers.id").onDelete("cascade").notNull(),
    )
    .addColumn("entity_id", "text", (col) => col.notNull())
    .addColumn("metadata_xml", "text", (col) => col.notNull())
    .addColumn("metadata_url", "text")
    .addColumn("attribute_mapping", "jsonb")
    .$call(TIMESTAMPS_COLUMN)
    .addCheckConstraint("saml_providers_entity_id_length_check", sql`(length(entity_id) > 0)`)
    .addCheckConstraint(
      "saml_providers_metadata_url_length_check",
      sql`(metadata_url IS NULL OR length(metadata_url) > 0)`,
    )
    .addCheckConstraint("saml_providers_metadata_xml_length_check", sql`(length(metadata_xml) > 0)`)
    .ifNotExists();

const SAMLProviderTableIndexes: TableIndexBuilder[] = [
  { kind: "unique", name: "saml_providers_entity_id_idx", column: "entity_id" },
  { kind: "normal", name: "saml_providers_sso_provider_id_idx", column: "sso_provider_id" },
];

//----------------------------------------------------------------------------
// Query to create `saml_relay_states` table
//----------------------------------------------------------------------------
const SAMLRelayStateMigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(tSamlRelayState.TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .addColumn("sso_provider_id", "text", (col) =>
      col.references("sso_providers.id").onDelete("cascade").notNull(),
    )
    .addColumn("flow_state_id", "text", (col) =>
      col.references("flow_state.id").onDelete("cascade").notNull(),
    )
    .addColumn("request_id", "text", (col) => col.notNull())
    .addColumn("for_email", "text")
    .addColumn("redirect_to", "text")
    .$call(TIMESTAMPS_COLUMN)
    .addCheckConstraint("saml_relay_states_request_id_length_check", sql`(length(request_id) > 0)`)
    .ifNotExists();

const SAMLRelayStateTableIndexes: TableIndexBuilder[] = [
  { kind: "normal", name: "saml_relay_states_created_at_idx", column: "created_at DESC" },
  { kind: "normal", name: "saml_relay_states_for_email_idx", column: "for_email" },
  { kind: "normal", name: "saml_relay_states_sso_provider_id_idx", column: "sso_provider_id" },
];

export async function up(db: KyselyDatabase): Promise<void> {
  // Run create tables migration
  await FlowStateMigrationQuery(db).execute();
  await SSOProviderMigrationQuery(db).execute();
  await SSODomainMigrationQuery(db).execute();
  await SAMLProviderMigrationQuery(db).execute();
  await SAMLRelayStateMigrationQuery(db).execute();

  // Run create indexes
  await Promise.all([
    FlowStateTableIndexes.map((index) => createIndex(db, tFlowState.TABLE_NAME, index)),
    SSOProviderTableIndexes.map((index) => createIndex(db, tSSOProvider.TABLE_NAME, index)),
    SSODomainTableIndexes.map((index) => createIndex(db, tSSODomain.TABLE_NAME, index)),
    SAMLProviderTableIndexes.map((index) => createIndex(db, tSamlProvider.TABLE_NAME, index)),
    SAMLRelayStateTableIndexes.map((index) => createIndex(db, tSamlRelayState.TABLE_NAME, index)),
  ]);
}

export async function down({ schema }: KyselyDatabase): Promise<void> {
  await Promise.all([
    SAMLRelayStateTableIndexes.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
    SAMLProviderTableIndexes.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
    SSODomainTableIndexes.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
    SSOProviderTableIndexes.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
    FlowStateTableIndexes.map(({ name }) => schema.dropIndex(name).ifExists().execute()),
  ]);
  await schema.dropTable(tSamlRelayState.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tSamlProvider.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tSSODomain.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tSSOProvider.TABLE_NAME).ifExists().execute();
  await schema.dropTable(tFlowState.TABLE_NAME).ifExists().execute();
}
