import { CreateTableBuilder, sql } from "kysely";

export const PRIMARY_KEY_COLUMN = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>,
) => builder.addColumn("id", "text", (col) => col.primaryKey());

export const TYPE_ID_COLUMN = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>,
) => builder.addColumn("type_id", "text", (col) => col.unique().notNull());

export const PRIMARY_KEY_SERIAL_COLUMN = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>,
) => builder.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement());

export const TIMESTAMPS_COLUMN = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>,
) => {
  return builder
    .addColumn("created_at", "integer", (col) => col.defaultTo(TIMESTAMP_MS).notNull())
    .addColumn("updated_at", "integer");
};

export const addSoftDeleteColumn = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>,
) => builder.addColumn("deleted_at", "integer");

// Timestamp in milliseconds for `created_at` column.
// ISO 8601 UTC timestamp: sql`SELECT strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`
export const TIMESTAMP_MS = sql`(strftime('%s', 'now'))`;
