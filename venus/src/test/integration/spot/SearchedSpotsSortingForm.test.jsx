import { useQuery } from "@tanstack/react-query";
import { screen, waitFor } from "@testing-library/react";
import { options } from "../../../pages/spot/components/SpotsSortingForm";
import userEvent from "@testing-library/user-event";
import { renderSearchedSpotsSortingForm } from "../../config/SearchedSpotsSortingFormTestsConfig";

vi.mock("@tanstack/react-query", async () => {
    return {
        ...(await vi.importActual("@tanstack/react-query")),
        useQuery: vi.fn(),
    };
});

describe("SearchedSpotsSortingForm component integration tests", () => {
    beforeEach(() => {
        useQuery.mockReturnValue({
            data: {},
            isLoading: false,
            error: null,
        });
        renderSearchedSpotsSortingForm();
    });
    test("Should render dropdown when arrow is clicked", async () => {
        const arrow = screen.getByTestId("searched-spots-sorting-arrow");
        await userEvent.click(arrow);

        const dropdown = screen.getByTestId("sorting-dropdown");
        expect(dropdown).toBeInTheDocument();
        expect(dropdown).toHaveRole("list");
        expect(dropdown.children.length).toBe(options.length);
    });
    test("Should not render dropdown when arrow was clicked after dropdown had been opened", async () => {
        const arrow = screen.getByTestId("searched-spots-sorting-arrow");
        await userEvent.click(arrow);
        const dropdown = screen.getByTestId("sorting-dropdown");
        expect(dropdown).toBeInTheDocument();

        await userEvent.click(arrow);
        await waitFor(() => {
            expect(dropdown).not.toBeInTheDocument();
        });
    });
    test("Should change the displayed sorting value, when new was clicked", async () => {
        const arrow = screen.getByTestId("searched-spots-sorting-arrow");
        await userEvent.click(arrow);
        const dropdown = screen.getByTestId("sorting-dropdown");
        await waitFor(() => {
            expect(dropdown).toBeInTheDocument();
        });

        const sortingOptions = screen.getAllByRole("listitem");
        const clickedOption = sortingOptions.find(
            (opt) => opt.textContent !== "Default",
        );

        await userEvent.click(clickedOption);

        await waitFor(() => {
            expect(
                screen.queryByTestId("sorting-dropdown"),
            ).not.toBeInTheDocument();
        });

        const sortingValue = screen.getByTestId("sorting-value");
        expect(sortingValue).toBeInTheDocument();
        expect(sortingValue).toHaveRole("paragraph");
        expect(sortingValue).toHaveTextContent(clickedOption.textContent);
    });
});
