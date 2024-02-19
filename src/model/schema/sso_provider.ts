import { Generated, Insertable, Selectable, Updateable } from 'npm:kysely';
import { WithTimeStampSchema } from '@/model/client.ts';

export const TABLE_NAME = 'sso_providers';

export interface SSOProviderTable extends WithTimeStampSchema {
  id: Generated<string>;
  resource_id: string;
}

export type SSOProvider = Selectable<SSOProviderTable>;
export type InsertSSOProvider = Insertable<SSOProviderTable>;
export type UpdateSSOProvider = Updateable<SSOProviderTable>;
