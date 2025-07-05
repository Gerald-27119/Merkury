import { screen, waitFor } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import {
    mockSpotNamesData,
    renderSpotsNameSearchBar,
} from "../../config/SpotsNameSearchBarTestsConfig";

vi.mock("@tanstack/react-query", async () => {
    return {
        ...(await vi.importActual("@tanstack/react-query")),
        useQuery: vi.fn(),
    };
});

describe("SpotsNameSearchBar component integration tests", () => {
    beforeEach(() => {
        useQuery.mockReturnValue({
            data: mockSpotNamesData,
            isLoading: false,
            error: null,
        });
        renderSpotsNameSearchBar();
    });

    test("Should render hints when user types and data is available", async () => {
        const input = screen.getByTestId("search-input");
        await userEvent.type(input, "spot");

        await waitFor(() => {
            expect(screen.getByRole("list")).toBeInTheDocument();
        });

        const items = screen.getAllByRole("listitem");
        expect(items).toHaveLength(mockSpotNamesData.length);
        mockSpotNamesData.forEach((hint, index) => {
            expect(items[index]).toHaveTextContent(hint);
        });
    });

    test("Should populate the input and hides the list when hint is clicked", async () => {
        const input = screen.getByTestId("search-input");
        await userEvent.type(input, "spot");
        await waitFor(() => screen.getByRole("list"));

        const firstHint = screen.getAllByRole("listitem")[0];
        await userEvent.click(firstHint);

        expect(input).toHaveValue(mockSpotNamesData[0]);
        expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
});
