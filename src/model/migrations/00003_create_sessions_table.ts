import { Database } from "@/model/client";
import { addPrimaryKeyUuidColumn, timestampMs } from "@/model/extends";
import { Kysely } from "kysely";

export const tableName = "sessions";

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .$call(addPrimaryKeyUuidColumn)
    .addColumn("user_id", "text", (col) => col.references("users.id").onDelete("cascade").notNull())
    .addColumn("expires_at", "integer", (col) => col.notNull())
    .addColumn("created_at", "integer", (col) => col.defaultTo(timestampMs).notNull())
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable(tableName).execute();
}
