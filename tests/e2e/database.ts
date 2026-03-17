import { existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";

/**
 * Fixed sqlite database path shared by Playwright setup, helpers, and the
 * backend process under test.
 */
export const E2E_DATABASE_FILE_PATH = path.join(
  process.cwd(),
  ".dbs",
  "e2e.db",
);

/**
 * Resolves the dedicated sqlite database used by Playwright.
 */
export function getE2EDatabaseFilePath(): string {
  return E2E_DATABASE_FILE_PATH;
}

/**
 * Removes any prior test database and reapplies the schema migrations so the
 * web server starts against a clean, deterministic database.
 */
export async function prepareE2EDatabase(): Promise<void> {
  const databaseFilePath = getE2EDatabaseFilePath();
  const databaseDirectory = path.dirname(databaseFilePath);

  if (!existsSync(databaseDirectory)) {
    mkdirSync(databaseDirectory, { recursive: true });
  }

  rmSync(databaseFilePath, { force: true });
  const { runMigrations } = await import("../../server/db/migrate.js");
  await runMigrations();
}
