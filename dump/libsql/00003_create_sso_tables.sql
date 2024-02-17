-- -----------------------------------------------------------------------------
-- Query to create `flow_state` table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS flow_state (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT,
    auth_code TEXT NOT NULL,
    code_challenge_method TEXT CHECK ( code_challenge_method IN ('s256','plain') ) NOT NULL DEFAULT 'plain', -- ENUM code_challenge_method
    code_challenge TEXT NOT NULL,
    provider_type TEXT NOT NULL,
    provider_access_token TEXT,
    provider_refresh_token TEXT,
    authentication_method TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
    updated_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS flow_state_created_at_idx ON flow_state (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_code ON flow_state (auth_code);
CREATE INDEX IF NOT EXISTS idx_user_id_auth_method ON flow_state (user_id, authentication_method);

-- -----------------------------------------------------------------------------
-- Query to create `sso_providers` table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sso_providers (
    id TEXT PRIMARY KEY NOT NULL,
    resource_id TEXT CHECK (resource_id IS NULL OR length(resource_id) > 0),
    created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
    updated_at INTEGER
);

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON sso_providers (lower(resource_id));

-- -----------------------------------------------------------------------------
-- Query to create `sso_domains` table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sso_domains (
    id TEXT PRIMARY KEY NOT NULL,
    sso_provider_id TEXT NOT NULL,
    domain TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
    updated_at INTEGER,
    FOREIGN KEY (sso_provider_id) REFERENCES sso_providers (id) ON DELETE CASCADE,
    CHECK (length(domain) > 0)
);

CREATE UNIQUE INDEX sso_domains_domain_idx ON sso_domains (domain);
CREATE INDEX IF NOT EXISTS sso_domains_sso_provider_id_idx ON sso_domains (sso_provider_id);

-- -----------------------------------------------------------------------------
-- Query to create `saml_providers` table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saml_providers (
    id TEXT PRIMARY KEY NOT NULL,
    sso_provider_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    metadata_xml TEXT NOT NULL,
    metadata_url TEXT,
    attribute_mapping JSON,
    created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
    updated_at INTEGER,
    FOREIGN KEY (sso_provider_id) REFERENCES sso_providers (id) ON DELETE CASCADE,
    CHECK (length(entity_id) > 0),
    CHECK (metadata_url IS NULL OR length(metadata_url) > 0),
    CHECK (length(metadata_xml) > 0),
    UNIQUE (entity_id)
);

CREATE INDEX IF NOT EXISTS saml_providers_sso_provider_id_idx ON saml_providers (sso_provider_id);

-- -----------------------------------------------------------------------------
-- Query to create `saml_relay_states` table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saml_relay_states (
    id TEXT PRIMARY KEY NOT NULL,
    sso_provider_id TEXT NOT NULL,
    flow_state_id TEXT,
    request_id TEXT NOT NULL,
    for_email TEXT,
    redirect_to TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
    updated_at INTEGER,
    FOREIGN KEY (sso_provider_id) REFERENCES sso_providers (id) ON DELETE CASCADE,
    FOREIGN KEY (flow_state_id) REFERENCES flow_state (id) ON DELETE CASCADE,
    CHECK (length(request_id) > 0)
);

CREATE INDEX IF NOT EXISTS saml_relay_states_created_at_idx ON saml_relay_states (created_at DESC);
CREATE INDEX IF NOT EXISTS saml_relay_states_for_email_idx ON saml_relay_states (for_email);
CREATE INDEX IF NOT EXISTS saml_relay_states_sso_provider_id_idx ON saml_relay_states (sso_provider_id);
