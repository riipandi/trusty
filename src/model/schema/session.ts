import { WithTimeStampSchema } from "@/model/client";
import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "sessions";

export type AalEnum = "aal1" | "aal2" | "aal3";

export interface SessionTable extends WithTimeStampSchema {
  id: Generated<string>;
  user_id: string;
  factor_id?: string;
  aal?: AalEnum;
  not_after?: ColumnType<Date, number | undefined, never>;
  user_agent?: string;
  ip?: string;
  tag?: string;
  refreshed_at?: ColumnType<Date, number | undefined, never>;
}

export type Session = Selectable<SessionTable>;
export type InsertSession = Insertable<SessionTable>;
export type UpdateSession = Updateable<SessionTable>;
