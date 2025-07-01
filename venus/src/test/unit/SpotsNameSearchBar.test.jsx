import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { searchedSpotsSlice } from "../../redux/searched-spots";
import { spotFiltersSlice } from "../../redux/spot-filters";
import { searchedSpotListModalSlice } from "../../redux/searched-spot-list-modal";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import SpotsNameSearchBar from "../../pages/map/components/spot-search/SpotsNameSearchBar";
import { describe } from "vitest";
import userEvent from "@testing-library/user-event";

const queryClient = new QueryClient();

vi.mock("@tanstack/react-query", async () => {
  return {
    ...(await vi.importActual("@tanstack/react-query")),
    useQuery: vi.fn(),
  };
});

const renderSpotsNameSearchBar = () => {
  const store = configureStore({
    reducer: {
      searchedSpots: searchedSpotsSlice.reducer,
      spotFilters: spotFiltersSlice.reducer,
      searchedSpotsListModal: searchedSpotListModalSlice.reducer,
    },
    preloadedState: {
      searchedSpots: searchedSpotsSlice.getInitialState(),
      spotFilters: {},
      searchedSpotsListModal: {},
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <SpotsNameSearchBar />
        </QueryClientProvider>
      </MemoryRouter>
    </Provider>,
  );
};

const mockSpotNamesData = ["name1, spot1, spot-name"];

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
    describe("SpotsNameSearchBar hints list behavior", () => {
      test("Should NOT render hints when input is empty", () => {
        expect(screen.queryByRole("list")).not.toBeInTheDocument();
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
  });
});
