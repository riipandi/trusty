-- -----------------------------------------------------------------------------
-- Query to create `mfa_amr_claims` table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mfa_amr_claims (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL,
    authentication_method TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- Query to create `mfa_challenges` table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mfa_challenges (
    id TEXT PRIMARY KEY NOT NULL,
    factor_id TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    verified_at INTEGER,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (factor_id) REFERENCES mfa_factors (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS mfa_challenge_created_at_idx ON mfa_challenges (created_at DESC);

-- -----------------------------------------------------------------------------
-- Query to create `mfa_factors` table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mfa_factors (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    friendly_name TEXT,
    factor_type TEXT CHECK ( factor_type IN ('totp','webauthn') ) NOT NULL DEFAULT 'totp', -- ENUM factor_type
    status TEXT CHECK ( status IN ('unverified','verified') ) NOT NULL DEFAULT 'unverified', -- ENUM factor_status
    secret TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS factor_id_created_at_idx ON mfa_factors (user_id, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS mfa_factors_user_friendly_name_unique ON mfa_factors (friendly_name, user_id)
WHERE trim(friendly_name) <> '';
CREATE INDEX IF NOT EXISTS mfa_factors_user_id_idx ON mfa_factors (user_id);
