import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HydrateFallback } from "../../../app/root";

describe("root hydrate fallback", () => {
  it("renders the enterprise document-stack loader instead of a spinner or shimmer bars", () => {
    const { container } = render(<HydrateFallback />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Loading application")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='hydrate-loader-title']")).not.toBeNull();
    expect(
      container.querySelector("[data-slot='hydrate-loader-caption']"),
    ).not.toBeNull();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(container.querySelector("[data-slot='hydrate-loader']")).not.toBeNull();
    expect(container.querySelector("svg.animate-spin")).toBeNull();
    expect(container.querySelectorAll("[data-slot='skeleton']")).toHaveLength(0);
    expect(container.querySelectorAll(".hydrate-loader__sheet")).toHaveLength(3);
    expect(
      container.querySelectorAll("[data-slot='hydrate-loader-shimmer']"),
    ).toHaveLength(1);
  });
});
