import { useQuery } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { describe } from "vitest";
import {
    mockSpotNamesData,
    renderSpotsNameSearchBar,
} from "../config/SpotsNameSearchBarTestsConfig";

vi.mock("@tanstack/react-query", async () => {
    return {
        ...(await vi.importActual("@tanstack/react-query")),
        useQuery: vi.fn(),
    };
});

describe("SpotsNameSearchBar component unit tests", () => {
    describe("Should display search bar correctly", () => {
        beforeEach(() => {
            useQuery.mockReturnValue({
                data: mockSpotNamesData,
                isLoading: false,
                error: null,
            });
            renderSpotsNameSearchBar();
        });
        test("Should render search icon", () => {
            expect(screen.getByTestId("search-icon")).toBeInTheDocument();
        });
        test("Should render input field", () => {
            expect(screen.getByTestId("search-input"));
        });

        test("Should NOT render hints when input is empty", () => {
            expect(screen.queryByRole("list")).not.toBeInTheDocument();
        });
    });
});
