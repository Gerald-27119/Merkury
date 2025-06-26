import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SortDropdown from "../../../../pages/account/photos/components/SortDropdown";

describe("SortDropdown renders correctly", () => {
  it("renders component with default selected option", () => {
    render(<SortDropdown onSelectType={vi.fn()} />);

    expect(screen.getByText("Sort:")).toBeInTheDocument();
    expect(screen.getByText("Date increase")).toBeInTheDocument();
  });

  it("renders toggle button", () => {
    render(<SortDropdown onSelectType={vi.fn()} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
