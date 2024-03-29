-- Drop indexes
DROP INDEX IF EXISTS confirmation_token_idx;
DROP INDEX IF EXISTS email_change_token_current_idx;
DROP INDEX IF EXISTS email_change_token_new_idx;
DROP INDEX IF EXISTS reauthentication_token_idx;
DROP INDEX IF EXISTS recovery_token_idx;
DROP INDEX IF EXISTS users_email_partial_key;
DROP INDEX IF EXISTS sso_providers_resource_id_idx;
DROP INDEX IF EXISTS sso_domains_sso_provider_id_idx;
DROP INDEX IF EXISTS sso_domains_domain_idx;
DROP INDEX IF EXISTS sessions_not_after_idx;
DROP INDEX IF EXISTS sessions_user_id_idx;
DROP INDEX IF EXISTS user_id_created_at_idx;
DROP INDEX IF EXISTS mfa_challenge_created_at_idx;
DROP INDEX IF EXISTS factor_id_created_at_idx;
DROP INDEX IF EXISTS identities_email_idx;
DROP INDEX IF EXISTS identities_user_id_idx;
DROP INDEX IF EXISTS flow_state_created_at_idx;
DROP INDEX IF EXISTS idx_auth_code;
DROP INDEX IF EXISTS idx_user_id_auth_method;
DROP INDEX IF EXISTS saml_relay_states_created_at_idx;
DROP INDEX IF EXISTS saml_relay_states_for_email_idx;
DROP INDEX IF EXISTS saml_relay_states_sso_provider_id_idx;
DROP INDEX IF EXISTS saml_providers_sso_provider_id_idx;
DROP INDEX IF EXISTS saml_providers_entity_id_key;
DROP INDEX IF EXISTS refresh_token_session_id;
DROP INDEX IF EXISTS refresh_tokens_parent_idx;
DROP INDEX IF EXISTS refresh_tokens_session_id_revoked_idx;
DROP INDEX IF EXISTS refresh_tokens_updated_at_idx;

-- Drop tables
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS sso_domains;
DROP TABLE IF EXISTS sso_providers;
DROP TABLE IF EXISTS saml_relay_states;
DROP TABLE IF EXISTS saml_providers;
DROP TABLE IF EXISTS mfa_challenges;
DROP TABLE IF EXISTS mfa_factors;
DROP TABLE IF EXISTS mfa_amr_claims;
DROP TABLE IF EXISTS identities;
DROP TABLE IF EXISTS flow_state;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS passwords;
DROP TABLE IF EXISTS users;

-- Kysely tables
DROP TABLE IF EXISTS _migration;
DROP TABLE IF EXISTS _migration_lock;
