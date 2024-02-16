import { WithTimeStampSchema } from "@/model/client";
import { Generated, Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "flow_state";

export type CodeChallengeMethod = "s256" | "plain";

export interface FlowStateTable extends WithTimeStampSchema {
  id: Generated<string>;
  user_id: string;
  auth_code: string;
  code_challenge_method: CodeChallengeMethod;
  code_challenge: string;
  provider_type: string;
  provider_access_token: string;
  provider_refresh_token: string;
  authentication_method: string;
}

export type FlowState = Selectable<FlowStateTable>;
export type InsertFlowState = Insertable<FlowStateTable>;
export type UpdateFlowState = Updateable<FlowStateTable>;
