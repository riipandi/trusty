import { type KyselyDatabase, WithTimeStampSchema } from "@/model/client";
import { PRIMARY_KEY_COLUMN, TIMESTAMPS_COLUMN } from "@/model/extends";
import type { TableIndexBuilder } from "@/model/extends";
import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "passwords";

export interface PasswordTable extends WithTimeStampSchema {
  user_id: string | null;
  encrypted_password: string | null;
}

export type Password = Selectable<PasswordTable>;
export type InsertPassword = Insertable<PasswordTable>;
export type UpdatePassword = Updateable<PasswordTable>;
