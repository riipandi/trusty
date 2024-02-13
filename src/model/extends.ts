import { CreateTableBuilder, Kysely, sql } from "kysely";
import { Database } from "@/model/client";

// Timestamp in milliseconds for `created_at` column.
// ISO 8601 UTC timestamp: sql.raw("SELECT strftime('%Y-%m-%dT%H:%M:%fZ', 'now')")
export const TIMESTAMP_MS = sql.raw("(strftime('%s', 'now'))");

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

export type QueryCreateIndex = { name: string; column: string; condition: string };

export async function createUniqueIndex(
  db: Kysely<Database>,
  table: string,
  index: QueryCreateIndex,
): Promise<void> {
  // Get all indexes: SELECT name FROM sqlite_master WHERE type='index';
  const query = `CREATE UNIQUE INDEX IF NOT EXISTS ${index.name} ON ${table} (${index.column}) ${index.condition};`;
  await sql
    .raw(query)
    .execute(db)
    .catch((err) => console.error("Failed to create index:", err.message));
}
