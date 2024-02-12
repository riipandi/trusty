import { WithTimeStampSchema } from "@/model/client";
import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface UserTable extends WithTimeStampSchema {
  id: Generated<string>;
  email: string;
  first_name: string;
  last_name: string | null;
}

export type User = Selectable<UserTable>;
export type InsertUser = Insertable<UserTable>;
export type UpdateUser = Updateable<UserTable>;

export interface PasswordTable extends WithTimeStampSchema {
  user_id: string;
  encrypted_password: string;
}

export type Password = Selectable<PasswordTable>;
export type InsertPassword = Insertable<PasswordTable>;
export type UpdatePassword = Updateable<PasswordTable>;
