import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";
import { type KyselyDatabase, WithTimeStampSchema } from "@/model/client";
import { PRIMARY_KEY_COLUMN, TIMESTAMPS_COLUMN, TIMESTAMP_MS } from "@/model/extends";
import type { TableIndexBuilder } from "@/model/extends";

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

export const MigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    // .addColumn("user_id", "text", (col) => col.references("users.id").onDelete("cascade").notNull())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("expires_at", "integer", (col) => col.notNull())
    .addColumn("created_at", "integer", (col) => col.defaultTo(TIMESTAMP_MS).notNull())
    .addForeignKeyConstraint(`${TABLE_NAME}_user_id_fk`, ["user_id"], "users", ["id"], (cb) =>
      cb.onDelete("cascade"),
    )
    .ifNotExists();

export const TABLE_INDEXES: TableIndexBuilder[] = [];
