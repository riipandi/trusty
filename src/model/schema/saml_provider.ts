import { Generated, Insertable, Selectable, Updateable } from 'npm:kysely';
import { WithTimeStampSchema } from '@/model/client.ts';

export const TABLE_NAME = 'saml_providers';

export interface SamlProviderTable extends WithTimeStampSchema {
  id: Generated<string>;
  sso_provider_id: string;
  entity_id: string;
  metadata_xml: string;
  metadata_url: string;
  attribute_mapping: Object;
}

export type SamlProvider = Selectable<SamlProviderTable>;
export type InsertSamlProvider = Insertable<SamlProviderTable>;
export type UpdateSamlProvider = Updateable<SamlProviderTable>;
