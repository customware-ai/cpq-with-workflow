import { existsSync } from "node:fs";
import BetterSqlite3 from "better-sqlite3";
import { expect, test } from "@playwright/test";
import { getE2EDatabaseFilePath } from "./database";

/**
 * Demonstrates how future e2e tests can seed deterministic backend state by
 * writing directly to the dedicated Playwright sqlite database before the page
 * loads. This helper is intentionally simple because this file is only a demo.
 *
 * REMOVE THIS FILE WHEN THE FIRST ACTUAL E2E TEST IS ADDED.
 */
function seedImaginaryFeatureState(): void {
  const databaseFilePath = getE2EDatabaseFilePath();
  const sqlite = new BetterSqlite3(databaseFilePath);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS demo_saved_views (
      id TEXT PRIMARY KEY,
      account_name TEXT NOT NULL,
      label TEXT NOT NULL
    );
  `);

  sqlite
    .prepare(
      `
        INSERT OR REPLACE INTO demo_saved_views (id, account_name, label)
        VALUES (?, ?, ?)
      `,
    )
    .run("demo-view-1", "BarkBilt", "Priority Opportunities");

  sqlite.close();
}

test.describe("demo e2e format", () => {
  test.skip("shows how an imaginary saved-view feature would be tested end to end", async ({
    page,
  }) => {
    // THIS IS ONLY A DEMO FILE FOR E2E TEST FORMAT.
    // THIS IS NOT A REAL PRODUCT TEST.
    // REMOVE THIS FILE WHEN THE FIRST ACTUAL E2E TEST IS ADDED.
    // REPLACE THIS SKIPPED EXAMPLE WITH REAL ASSERTIONS FOR A SHIPPED FEATURE.

    seedImaginaryFeatureState();

    await page.goto("/");

    // Imagine the real UI exposed a saved-view launcher in the shell.
    await page.getByRole("button", { name: "Saved views" }).click();
    await page.getByRole("button", { name: "Priority Opportunities" }).click();

    // Imagine the frontend then rendered a filtered workspace scoped to the
    // seeded backend record from the dedicated Playwright database.
    await expect(
      page.getByRole("heading", { name: "Priority Opportunities" }),
    ).toBeVisible();
    await expect(page.getByText("BarkBilt")).toBeVisible();
    expect(existsSync(getE2EDatabaseFilePath())).toBe(true);
  });
});
