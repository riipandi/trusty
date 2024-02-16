import { WithTimeStampSchema } from "@/model/client";
import { Generated, Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "sso_domains";

export interface SSODomainTable extends WithTimeStampSchema {
  id: Generated<string>;
  sso_provider_id: string;
  domain: string;
}

export type SSODomain = Selectable<SSODomainTable>;
export type InsertSSODomain = Insertable<SSODomainTable>;
export type UpdateSSODomain = Updateable<SSODomainTable>;
