import * as v from "valibot";

export const LoginRequestSchema = v.object({
  username: v.string(),
  password: v.string(),
});

export type LoginRequest = v.Input<typeof LoginRequestSchema>;
