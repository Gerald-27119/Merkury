import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { searchedSpotsSlice } from "../../redux/searched-spots";
import { spotFiltersSlice } from "../../redux/spot-filters";
import { searchedSpotListModalSlice } from "../../redux/searched-spot-list-modal";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import SpotsNameSearchBar from "../../pages/map/components/spot-search/SpotsNameSearchBar";
import { describe } from "vitest";

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
  describe("Should display search bar correctly and hints should be hidden when nothing is typed", () => {
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
  });
});
