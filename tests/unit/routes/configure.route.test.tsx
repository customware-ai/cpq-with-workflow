import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import ConfigureEstimatePage from "../../../app/routes/configure.$estimateId";
import { clearCpqWorkspaceFromStorage, seedCpqWorkspaceInStorage } from "../../../app/utils/cpq-storage";
import {
  addCatalogItemToEstimateInWorkspace,
  createDefaultCpqWorkspace,
  formatCurrency,
  getEstimateTotals,
} from "../../../app/lib/cpq-data";

describe("configure route", () => {
  beforeEach(() => {
    clearCpqWorkspaceFromStorage();
    seedCpqWorkspaceInStorage();
  });

  it("adds a catalog item and updates the build totals", async () => {
    const expectedTotal = formatCurrency(
      getEstimateTotals(
        addCatalogItemToEstimateInWorkspace(
          createDefaultCpqWorkspace(),
          "est-001002",
          "item-dc-com-hoist",
        ),
        "est-001002",
      ).total,
    );

    render(
      <MemoryRouter initialEntries={["/configure/est-001002"]}>
        <Routes>
          <Route path="/configure/:estimateId" element={<ConfigureEstimatePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Configure" })).toBeInTheDocument();

    await userEvent.click(screen.getAllByRole("button", { name: "Add" })[2]!);

    expect(await screen.findByText(expectedTotal)).toBeInTheDocument();
  });

  it("filters the catalog from the intake prompt", async () => {
    render(
      <MemoryRouter initialEntries={["/configure/est-001002"]}>
        <Routes>
          <Route path="/configure/:estimateId" element={<ConfigureEstimatePage />} />
        </Routes>
      </MemoryRouter>,
    );

    const intakePrompt = await screen.findByRole("textbox");

    await userEvent.clear(intakePrompt);
    await userEvent.type(intakePrompt, "inspection");

    expect((await screen.findAllByText("Inspection Plan")).length).toBeGreaterThan(0);
    expect(screen.queryByText("Double Girder")).not.toBeInTheDocument();
  });
});
