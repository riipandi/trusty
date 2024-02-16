-- -----------------------------------------------------------------------------
-- Query to create `users` table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    aud TEXT,
    role TEXT,
    email TEXT,
    email_change_token_new TEXT,
    email_change TEXT,
    email_change_token_current TEXT DEFAULT '',
    email_change_confirm_status INTEGER DEFAULT 0,
    phone TEXT DEFAULT NULL,
    phone_change TEXT DEFAULT '',
    phone_change_token TEXT DEFAULT '',
    raw_app_meta_data JSON,
    raw_user_meta_data JSON,
    confirmation_token TEXT,
    recovery_token TEXT,
    reauthentication_token TEXT DEFAULT '',
    is_super_admin INTEGER NOT NULL DEFAULT 0, -- BOOLEAN
    is_sso_user INTEGER NOT NULL DEFAULT 0, -- BOOLEAN
    last_sign_in_at INTEGER,
    banned_until INTEGER,
    invited_at INTEGER,
    email_confirmed_at INTEGER,
    email_change_sent_at INTEGER,
    phone_confirmed_at INTEGER,
    phone_change_sent_at INTEGER,
    confirmation_sent_at INTEGER,
    recovery_sent_at INTEGER,
    reauthentication_sent_at INTEGER,
    confirmed_at INTEGER,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER,
    deleted_at INTEGER,
    UNIQUE(phone),
    CHECK(email_change_confirm_status >= 0 AND email_change_confirm_status <= 2)
);

CREATE UNIQUE INDEX IF NOT EXISTS confirmation_token_idx ON users (confirmation_token) WHERE confirmation_token NOT LIKE '^[0-9 ]*$';
CREATE UNIQUE INDEX IF NOT EXISTS email_change_token_current_idx ON users (email_change_token_current) WHERE email_change_token_current NOT LIKE '^[0-9 ]*$';
CREATE UNIQUE INDEX IF NOT EXISTS email_change_token_new_idx ON users (email_change_token_new) WHERE email_change_token_new NOT LIKE '^[0-9 ]*$';
CREATE UNIQUE INDEX IF NOT EXISTS reauthentication_token_idx ON users (reauthentication_token) WHERE reauthentication_token NOT LIKE '^[0-9 ]*$';
CREATE UNIQUE INDEX IF NOT EXISTS recovery_token_idx ON users (recovery_token) WHERE recovery_token NOT LIKE '^[0-9 ]*$';
CREATE UNIQUE INDEX IF NOT EXISTS users_email_partial_key ON users (email) WHERE is_sso_user = 0;

-- -----------------------------------------------------------------------------
-- Query to create `passwords` table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS passwords (
    user_id TEXT NOT NULL,
    encrypted_password TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE NO ACTION
);

-- -----------------------------------------------------------------------------
-- Query to create `sessions` table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    factor_id TEXT,
    aal TEXT CHECK ( aal IN ('aal1','aal2','aal3') ) NOT NULL DEFAULT 'aal1', -- ENUM all_level
    not_after INTEGER,
    user_agent TEXT,
    ip TEXT,
    tag TEXT,
    refreshed_at INTEGER,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (factor_id) REFERENCES mfa_factors (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS sessions_not_after_idx ON sessions (not_after DESC);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);
CREATE INDEX IF NOT EXISTS user_id_created_at_idx ON sessions (user_id, created_at);

-- -----------------------------------------------------------------------------
-- Query to create `refresh_tokens` table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    user_id TEXT,
    token TEXT,
    revoked INTEGER NOT NULL DEFAULT 0, -- BOOLEAN
    parent TEXT,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER,
    FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS refresh_tokens_token_unique ON refresh_tokens (token);
CREATE INDEX IF NOT EXISTS refresh_token_session_id ON refresh_tokens (session_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_parent_idx ON refresh_tokens (parent);
CREATE INDEX IF NOT EXISTS refresh_tokens_session_id_revoked_idx ON refresh_tokens (session_id, revoked);
CREATE INDEX IF NOT EXISTS refresh_tokens_updated_at_idx ON refresh_tokens (updated_at DESC);

-- -----------------------------------------------------------------------------
-- Query to create `identities` table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS identities (
    id TEXT PRIMARY KEY NOT NULL,
    provider_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    email TEXT,
    identity_data JSON NOT NULL,
    provider TEXT NOT NULL,
    last_sign_in_at INTEGER,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS identities_provider_id_provider_unique ON identities (provider_id, provider);
CREATE INDEX IF NOT EXISTS identities_email_idx ON identities (email);
CREATE INDEX IF NOT EXISTS identities_user_id_idx ON identities (user_id);

-- -----------------------------------------------------------------------------
-- Query to create `audit_log` table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY NOT NULL,
    payload JSON,
    ip_address TEXT DEFAULT '',
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);
