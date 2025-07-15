import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { searchedSpotsSlice } from "../../redux/searched-spots";
import { spotFiltersSlice } from "../../redux/spot-filters";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import SearchedSpotsSortingForm from "../../pages/spot/components/searched-spot/SearchedSpotsSortingForm";

const queryClient = new QueryClient();

export const renderSearchedSpotsSortingForm = () => {
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
                    <SearchedSpotsSortingForm
                        queryKeyToRemoveQueries={[]}
                        sorting={"none"}
                        onSelectSorting={() => {}}
                        onClear={() => {}}
                    />
                </QueryClientProvider>
            </MemoryRouter>
        </Provider>,
    );
};
