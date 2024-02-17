import * as v from "valibot";

export const TokenRequestSchema = v.object({
  email: v.string(),
  password: v.string(),
  phone: v.nullish(v.string()),
  id_token: v.nullish(v.string()),
  access_token: v.nullish(v.string()),
  refresh_token: v.nullish(v.string()),
  nonce: v.nullish(v.string()),
  provider: v.nullish(v.string()),
  client_id: v.nullish(v.string()),
  issuer: v.nullish(v.string()),
  gotrue_meta_security: v.optional(
    v.object({
      captcha_token: v.nullable(v.string()),
    }),
  ),
  auth_code: v.nullish(v.string()),
  code_verifier: v.nullish(v.string()),
});

export type LoginRequest = v.Input<typeof TokenRequestSchema>;
