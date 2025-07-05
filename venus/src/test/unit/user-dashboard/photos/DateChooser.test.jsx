import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DateChooser from "../../../../pages/account/photos/components/DateChooser";

describe("DateChooser renders correctly", () => {
    it("renders 'From:' label when type is 'from'", () => {
        render(<DateChooser text="From:" onChange={vi.fn()} />);
        expect(screen.getByText("From:")).toBeInTheDocument();
    });

    it("renders 'To:' label when type is 'to'", () => {
        render(<DateChooser text="To:" onChange={vi.fn()} />);
        expect(screen.getByText("To:")).toBeInTheDocument();
    });

    it("renders the DatePicker component", () => {
        render(<DateChooser text="from" onChange={vi.fn()} />);

        expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
});
