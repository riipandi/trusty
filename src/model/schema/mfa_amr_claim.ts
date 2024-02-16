import { WithTimeStampSchema } from "@/model/client";
import { Generated, Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "mfa_amr_claims";

export interface MfaAmrClaimTable extends WithTimeStampSchema {
  id: Generated<string>;
  session_id: string;
  authentication_method: string;
}

export type MfaAmrClaim = Selectable<MfaAmrClaimTable>;
export type InsertMfaAmrClaim = Insertable<MfaAmrClaimTable>;
export type UpdateMfaAmrClaim = Updateable<MfaAmrClaimTable>;
