import { Insertable, Selectable, Updateable } from 'npm:kysely';
import { WithTimeStampSchema } from '@/model/client.ts';

export const TABLE_NAME = 'passwords';

export interface PasswordTable extends WithTimeStampSchema {
  user_id: string | null;
  encrypted_password: string | null;
}

export type Password = Selectable<PasswordTable>;
export type InsertPassword = Insertable<PasswordTable>;
export type UpdatePassword = Updateable<PasswordTable>;
