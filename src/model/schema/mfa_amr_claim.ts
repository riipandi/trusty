import { Generated, Insertable, Selectable, Updateable } from 'npm:kysely';
import { WithTimeStampSchema } from '@/model/client.ts';

export const TABLE_NAME = 'mfa_amr_claims';

export interface MfaAmrClaimTable extends WithTimeStampSchema {
  id: Generated<string>;
  session_id: string;
  authentication_method: string;
}

export type MfaAmrClaim = Selectable<MfaAmrClaimTable>;
export type InsertMfaAmrClaim = Insertable<MfaAmrClaimTable>;
export type UpdateMfaAmrClaim = Updateable<MfaAmrClaimTable>;
