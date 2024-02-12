import { CreateTableBuilder, sql } from "kysely";

export const addPrimaryKeyUuidColumn = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>,
) => {
  return builder.addColumn("id", "text", (col) => col.primaryKey().notNull());
};

export const addTypedIdColumn = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>,
) => {
  return builder.addColumn("type_id", "text", (col) => col.unique().notNull());
};

export const addPrimaryKeySerialColumn = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>,
) => {
  return builder.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement());
};

export const addTimeStampColumns = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>,
) => {
  return builder
    .addColumn("created_at", "integer", (col) => col.defaultTo(timestampMs).notNull())
    .addColumn("updated_at", "integer");
};

export const addSoftDeleteColumn = <T extends string, C extends string = never>(
  builder: CreateTableBuilder<T, C>,
) => {
  return builder.addColumn("deleted_at", "integer");
};

// Timestamp in milliseconds for `created_at` column.
// ISO 8601 UTC timestamp: sql`SELECT strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`
export const timestampMs = sql`(strftime('%s', 'now'))`;
