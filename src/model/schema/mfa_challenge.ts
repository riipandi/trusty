import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'npm:kysely';

export const TABLE_NAME = 'mfa_challenges';

export interface MfaChallengeTable {
  id: Generated<string>;
  factor_id: string;
  ip_address: string;
  verified_at: ColumnType<Date, number | undefined, never>;
  updated_at: ColumnType<Date, number | undefined, never>;
}

export type MfaChallenge = Selectable<MfaChallengeTable>;
export type InsertMfaChallenge = Insertable<MfaChallengeTable>;
export type UpdateMfaChallenge = Updateable<MfaChallengeTable>;
