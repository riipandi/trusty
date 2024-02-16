import { WithTimeStampSchema } from "@/model/client";
import { Generated, Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "mfa_factors";

export type FactorType = "totp" | "webauthn";
export type FactorStatus = "unverified" | "verified";

export interface MfaFactorTable extends WithTimeStampSchema {
  id: Generated<string>;
  user_id: string;
  friendly_name: string;
  factor_type: FactorType;
  status: FactorStatus;
  secret: string;
}

export type MfaFactor = Selectable<MfaFactorTable>;
export type InsertMfaFactor = Insertable<MfaFactorTable>;
export type UpdateMfaFactor = Updateable<MfaFactorTable>;
