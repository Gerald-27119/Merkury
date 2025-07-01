import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { searchedSpotsSlice } from "../../redux/searched-spots";
import { spotFiltersSlice } from "../../redux/spot-filters";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import SearchedSpotsSortingForm, {
  options,
} from "../../pages/spot/components/searched-spot/SearchedSpotsSortingForm";
import userEvent from "@testing-library/user-event";

const queryClient = new QueryClient();

vi.mock("@tanstack/react-query", async () => {
  return {
    ...(await vi.importActual("@tanstack/react-query")),
    useQuery: vi.fn(),
  };
});

const renderSearchedSpotsSortingForm = () => {
  const store = configureStore({
    reducer: {
      searchedSpots: searchedSpotsSlice.reducer,
      spotFilters: spotFiltersSlice.reducer,
    },
    preloadedState: {
      searchedSpots: searchedSpotsSlice.getInitialState(),
      spotFilters: { name: "spot1", sorting: "none" },
    },
  });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <SearchedSpotsSortingForm />
        </QueryClientProvider>
      </MemoryRouter>
    </Provider>,
  );
};

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
      expect(screen.queryByTestId("sorting-dropdown")).not.toBeInTheDocument();
    });

    const sortingValue = screen.getByTestId("sorting-value");
    expect(sortingValue).toBeInTheDocument();
    expect(sortingValue).toHaveRole("paragraph");
    expect(sortingValue).toHaveTextContent(clickedOption.textContent);
  });
});
