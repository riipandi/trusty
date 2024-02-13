import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { consola } from "consola";

import { db } from "@/model/client";
import { userSeeder } from "@/model/seeders/user.seed";
import { FileMigrationProvider, Migrator, NO_MIGRATIONS } from "kysely";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationFolder = path.resolve(__dirname, "./model/migrations");

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({ fs, path, migrationFolder }),
  migrationTableName: "_migration",
  migrationLockTableName: "_migration_lock",
  allowUnorderedMigrations: false,
});

async function runMigration() {
  const { error, results } = await migrator.migrateToLatest();

  if (error) {
    consola.error("🔥 failed to migrate", error);
    process.exit(1);
  }

  results?.map((it) => {
    if (it.status === "Success") {
      consola.info(`⌛️ migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      consola.error(`🔥 failed to execute migration "${it.migrationName}"`);
    }
  });

  await db.destroy();
}

async function rollbackMigration() {
  const { error, results } = await migrator.migrateTo(NO_MIGRATIONS);

  if (error) {
    consola.error("🔥 failed to rollback", error);
    process.exit(1);
  }

  return results?.map((it) => {
    if (it.status === "Success") {
      consola.info(`⌛️ rolling back to "${it.migrationName}"`);
    } else if (it.status === "Error") {
      consola.error(`🔥 failed to rollback migration "${it.migrationName}"`);
    }
  });
}

async function runSeeder() {
  await userSeeder(db)
    .then(async () => {
      consola.info("🍀 Database has been populated with seeders");
      process.exit(0);
    })
    .catch(async (e) => {
      consola.error("🔥 Failed running database seeder:", e.message);
      process.exit(1);
    })
    .finally(async () => await db.destroy());
}

switch (process.argv[2]) {
  case "rollback":
    consola.info("🍀 Rolling back migration...");
    rollbackMigration();
    break;
  case "seed":
    consola.info("🍀 Populating database with seeders...");
    runSeeder();
    break;
  default:
    consola.info("🍀 Running database migration...");
    runMigration();
    break;
}
