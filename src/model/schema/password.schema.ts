import { WithTimeStampSchema } from "@/model/client";
import { Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "passwords";

export interface PasswordTable extends WithTimeStampSchema {
  user_id: string | null;
  encrypted_password: string | null;
}

export type Password = Selectable<PasswordTable>;
export type InsertPassword = Insertable<PasswordTable>;
export type UpdatePassword = Updateable<PasswordTable>;
