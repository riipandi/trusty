import { WithTimeStampSchema } from "@/model/client";
import { Generated, Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "refresh_tokens";

export interface RefreshTokenTable extends WithTimeStampSchema {
  id: Generated<string>;
  session_id?: string;
  user_id?: string;
  token?: string;
  revoked: boolean;
  parent?: string;
}

export type RefreshToken = Selectable<RefreshTokenTable>;
export type InsertRefreshToken = Insertable<RefreshTokenTable>;
export type UpdateRefreshToken = Updateable<RefreshTokenTable>;
