import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { searchedSpotsSlice } from "../../redux/searched-spots";
import { spotFiltersSlice } from "../../redux/spot-filters";
import { searchedSpotListModalSlice } from "../../redux/searched-spot-list-modal";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import SpotsNameSearchBar from "../../pages/map/components/spot-search/SpotsNameSearchBar";

const queryClient = new QueryClient();

export const renderSpotsNameSearchBar = () => {
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

export const mockSpotNamesData = ["name1, spot1, spot-name"];
