import { Generated, Insertable, Selectable, Updateable } from 'npm:kysely';
import { WithTimeStampSchema } from '@/model/client.ts';

export const TABLE_NAME = 'sso_domains';

export interface SSODomainTable extends WithTimeStampSchema {
  id: Generated<string>;
  sso_provider_id: string;
  domain: string;
}

export type SSODomain = Selectable<SSODomainTable>;
export type InsertSSODomain = Insertable<SSODomainTable>;
export type UpdateSSODomain = Updateable<SSODomainTable>;
