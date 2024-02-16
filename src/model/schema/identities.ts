import { WithTimeStampSchema } from "@/model/client";
import { Generated, Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "identities";

export interface IdentitiesTable extends WithTimeStampSchema {
  id: Generated<string>;
  provider_id: string;
  user_id: string;
  email?: string;
  identity_data: Object;
  provider: string;
  last_sign_in_at: number;
}

export type Identities = Selectable<IdentitiesTable>;
export type InsertIdentities = Insertable<IdentitiesTable>;
export type UpdateIdentities = Updateable<IdentitiesTable>;
