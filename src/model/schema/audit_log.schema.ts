import { type KyselyDatabase, WithTimeStampSchema } from "@/model/client";
import { PRIMARY_KEY_COLUMN, TIMESTAMPS_COLUMN } from "@/model/extends";
import type { TableIndexBuilder } from "@/model/extends";
import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export const TABLE_NAME = "audit_log";

export const MigrationQuery = (db: KyselyDatabase) =>
  db.schema
    .createTable(TABLE_NAME)
    .$call(PRIMARY_KEY_COLUMN)
    .$call(TIMESTAMPS_COLUMN)
    .ifNotExists();

export const TABLE_INDEXES: TableIndexBuilder[] = [];
