import { WithTimeStampSchema } from "@/model/client";
import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "sessions";

export interface SessionTable extends WithTimeStampSchema {
  id: Generated<string>;
  user_id: string;
  expires_at: number;
  created_at: ColumnType<Date, number | undefined, never>;
}

export type Session = Selectable<SessionTable>;
export type InsertSession = Insertable<SessionTable>;
export type UpdateSession = Updateable<SessionTable>;
