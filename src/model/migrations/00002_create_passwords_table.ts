import { Database } from "@/model/client";
import { addTimeStampColumns } from "@/model/extends";
import { Kysely } from "kysely";

export const tableName = "passwords";

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn("user_id", "text", (col) =>
      col.references("users.id").onDelete("no action").notNull().unique(),
    )
    .addColumn("encrypted_password", "text", (col) => col.notNull())
    .$call(addTimeStampColumns)
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable(tableName).execute();
}
