import { Database } from "@/model/client";
import { addPrimaryKeyUuidColumn, addTimeStampColumns } from "@/model/extends";
import { Kysely } from "kysely";

export const tableName = "users";

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .$call(addPrimaryKeyUuidColumn)
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("first_name", "text", (col) => col.notNull())
    .addColumn("last_name", "text", (col) => col.notNull())
    .$call(addTimeStampColumns)
    .execute();

  await db.schema.createIndex("users_email_index").on(tableName).column("email").execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable(tableName).execute();
}
