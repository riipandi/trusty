import { WithTimeStampSchema } from "@/model/client";
import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "users";

export interface UserTable extends WithTimeStampSchema {
  id: Generated<string>;
  aud?: string | null;
  role?: string | null;
  email: string;
  email_change_token_new?: string | null;
  email_change?: string | null;
  email_change_token_current?: string | null;
  email_change_confirm_status?: number;
  phone?: string | null;
  phone_change?: string | null;
  phone_change_token?: string | null;
  raw_app_meta_data?: Object;
  raw_user_meta_data?: Object;
  confirmation_token?: string | null;
  recovery_token?: string | null;
  reauthentication_token?: string | null;
  is_super_admin: boolean;
  is_sso_user: boolean;
  last_sign_in_at?: ColumnType<Date, number | undefined, never>;
  banned_until?: ColumnType<Date, number | undefined, never>;
  invited_at?: ColumnType<Date, number | undefined, never>;
  email_confirmed_at?: ColumnType<Date, number | undefined, never>;
  email_change_sent_at?: ColumnType<Date, number | undefined, never>;
  phone_confirmed_at?: ColumnType<Date, number | undefined, never>;
  phone_change_sent_at?: ColumnType<Date, number | undefined, never>;
  confirmation_sent_at?: ColumnType<Date, number | undefined, never>;
  recovery_sent_at?: ColumnType<Date, number | undefined, never>;
  reauthentication_sent_at?: ColumnType<Date, number | undefined, never>;
  confirmed_at?: ColumnType<Date, number | undefined, never>;
}

export type User = Selectable<UserTable>;
export type InsertUser = Insertable<UserTable>;
export type UpdateUser = Updateable<UserTable>;
