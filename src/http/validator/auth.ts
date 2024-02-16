import * as v from "valibot";

export const LoginRequestSchema = v.object({
  refresh_token: v.string(),
  password: v.string(),
  email: v.string(),
  phone: v.string(),
  id_token: v.string(),
  access_token: v.string(),
  nonce: v.string(),
  provider: v.string(),
  client_id: v.string(),
  issuer: v.string(),
  // gotrue_meta_security: {
  //   captcha_token: v.string(),
  // },
  auth_code: v.string(),
  code_verifier: v.string(),
});

export type LoginRequest = v.Input<typeof LoginRequestSchema>;
