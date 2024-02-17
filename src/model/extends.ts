import type { KyselyDatabase } from "@/model/client";
import { CreateTableBuilder, sql } from "kysely";

// Timestamp in milliseconds for `created_at` column.
// ISO 8601 UTC timestamp: sql.raw("SELECT strftime('%Y-%m-%dT%H:%M:%fZ', 'now')")
export const TIMESTAMP_MS = sql.raw("(strftime('%s', 'now'))");
export const UUID_V4 = sql.raw(
  "(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))), 2) || '-' || substr('89ab', 1 + (abs(random()) % 4) , 1) || substr(lower(hex(randomblob(2))), 2) || '-' || lower(hex(randomblob(6))))",
);

export const PRIMARY_KEY_COLUMN = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>,
) => builder.addColumn("id", "text", (col) => col.primaryKey().defaultTo(UUID_V4).notNull());

export const PRIMARY_KEY_SERIAL_COLUMN = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>,
) => builder.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement());

export const PUBLIC_ID_COLUMN = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>,
) => {
  return builder.addColumn("public_id", "text", (col) =>
    col.unique().defaultTo(sql.raw("(lower(hex(randomblob(12))))")).notNull(),
  );
};

export const TIMESTAMPS_COLUMN = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>,
) => {
  return builder
    .addColumn("created_at", "integer", (col) => col.defaultTo(TIMESTAMP_MS).notNull())
    .addColumn("updated_at", "integer");
};

export type TableIndexBuilder = {
  kind: "unique" | "normal";
  name: string;
  column: string | string[];
  condition?: string;
};

export async function createIndex(
  db: KyselyDatabase,
  table: string,
  index: TableIndexBuilder,
): Promise<void> {
  // Get all indexes: SELECT * FROM sqlite_master WHERE type = 'index' AND sql != '';
  const { kind, name, column, condition } = index;
  const unique = kind === "unique" ? "UNIQUE " : "";
  const params = `${name} ON ${table} (${column}) ${condition ?? ""}`;
  const query = `CREATE ${unique}INDEX IF NOT EXISTS ${params};`;

  // console.log(sql.raw(query).compile(db).sql);

  await sql
    .raw(query)
    .execute(db)
    .catch((err) => console.error(`Failed to create index ${index.name}:`, err.message));
}
