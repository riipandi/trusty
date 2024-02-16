import { WithTimeStampSchema } from "@/model/client";
import { Generated, Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "saml_relay_states";

export interface SamlRelayStateTable extends WithTimeStampSchema {
  id: Generated<string>;
  sso_provider_id: string;
  flow_state_id: string;
  request_id: string;
  for_email: string;
  redirect_to: string;
}

export type SamlRelayState = Selectable<SamlRelayStateTable>;
export type InsertSamlRelayState = Insertable<SamlRelayStateTable>;
export type UpdateSamlRelayState = Updateable<SamlRelayStateTable>;
