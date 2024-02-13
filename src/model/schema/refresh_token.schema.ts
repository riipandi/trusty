import { WithTimeStampSchema } from "@/model/client";
import { Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "refresh_tokens";

export interface RefreshTokenTable extends WithTimeStampSchema {}

export type RefreshToken = Selectable<RefreshTokenTable>;
export type InsertRefreshToken = Insertable<RefreshTokenTable>;
export type UpdateRefreshToken = Updateable<RefreshTokenTable>;
