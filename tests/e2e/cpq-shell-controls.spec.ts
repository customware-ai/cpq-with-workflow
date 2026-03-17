import { expect, test } from "@playwright/test";
import { seedWorkspace } from "./support/cpq";

test.describe("cpq shell controls e2e", () => {
  test("supports division creation and read-only role preview", async ({
    page,
  }) => {
    await page.goto("/");
    await seedWorkspace(page);
    await page.reload();

    await page.getByRole("button", { name: "Add Division" }).click();

    await expect(page).toHaveURL(/\/configure\/est-/);
    await expect(
      page.getByText("Add packages or products to start the build."),
    ).toBeVisible();

    await page.locator("main").getByRole("link", { name: "Dashboard" }).click();

    await expect(
      page.getByRole("heading", { name: "Opportunities (3)" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "View as Role" }).click();
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Viewer" }).click();

    await expect(page.getByText("Active role: viewer")).toBeVisible();
    await page.keyboard.press("Escape");

    await page.getByRole("link", { name: /DR INC - PM/ }).click();

    await expect(
      page.getByRole("button", { name: "Approval Role Required" }),
    ).toBeDisabled();

    await page.getByRole("link", { name: "Open Configure" }).click();

    await expect(
      page.getByText("viewer role is read-only", { exact: false }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Read Only" }).first(),
    ).toBeDisabled();
    await expect(page.getByLabel("Build total")).toHaveText("Hidden");

    await page.reload();

    await expect(
      page.getByText("viewer role is read-only", { exact: false }),
    ).toBeVisible();
    await expect(page.getByLabel("Build total")).toHaveText("Hidden");
  });
});
