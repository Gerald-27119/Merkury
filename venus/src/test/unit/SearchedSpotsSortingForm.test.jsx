import { useQuery } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { renderSearchedSpotsSortingForm } from "../config/SearchedSpotsSortingFormTestsConfig.jsx";

vi.mock("@tanstack/react-query", async () => {
    return {
        ...(await vi.importActual("@tanstack/react-query")),
        useQuery: vi.fn(),
    };
});

describe("SearchedSpotsSortingForm component unit tests", () => {
    beforeEach(() => {
        useQuery.mockReturnValue({
            data: {},
            isLoading: false,
            error: null,
        });
        renderSearchedSpotsSortingForm();
    });

    test("Should render Sort paragraph", () => {
        const paragraph = screen.getByText(/sort/i);
        expect(paragraph).toBeInTheDocument();
        expect(paragraph).toHaveRole("paragraph");
    });
    test("Should render arrow to open dropdown", () => {
        expect(
            screen.getByTestId("searched-spots-sorting-arrow"),
        ).toBeInTheDocument();
    });
    test("Should render default value for sorting", () => {
        const defaultSoringValue = screen.getByTestId("sorting-value");
        expect(defaultSoringValue).toBeInTheDocument();
        expect(defaultSoringValue).toHaveRole("paragraph");
        expect(defaultSoringValue).toHaveTextContent(/default/i);
    });
});
