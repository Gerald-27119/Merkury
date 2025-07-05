import {
    QueryClient,
    QueryClientProvider,
    useInfiniteQuery,
} from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { sidebarSlice } from "../../redux/sidebar";
import { searchedSpotListModalSlice } from "../../redux/searched-spot-list-modal";
import { searchedSpotsSlice } from "../../redux/searched-spots";
import { spotFiltersSlice } from "../../redux/spot-filters";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import SearchedSpotsList from "../../pages/spot/SearchedSpotsList";

const queryClient = new QueryClient();

vi.mock("@tanstack/react-query", async () => {
    return {
        ...(await vi.importActual("@tanstack/react-query")),
        useInfiniteQuery: vi.fn(),
    };
});

const renderSearchedSpotsList = () => {
    const store = configureStore({
        reducer: {
            sidebar: sidebarSlice.reducer,
            searchedSpotsListModal: searchedSpotListModalSlice.reducer,
            searchedSpots: searchedSpotsSlice.reducer,
            spotFilters: spotFiltersSlice.reducer,
        },
        preloadedState: {
            searchedSpots: searchedSpotsSlice.getInitialState(),
            spotFilters: {
                name: "",
                sorting: "none",
            },
            searchedSpotsListModal: {
                showList: true,
            },
            sidebar: {
                isOpen: true,
            },
        },
    });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <SearchedSpotsList />
                </QueryClientProvider>
            </MemoryRouter>
        </Provider>,
    );
};

const mockData = {
    content: [
        {
            id: 1,
            name: "spot1",
            rating: 3.5,
            ratingCount: 10,
            firstPhoto: "photo1UrlMock",
            tags: [
                { id: 1, name: "tag1" },
                { id: 2, name: "tag2" },
            ],
            centerPoint: {
                x: 1.0,
                y: 2.0,
            },
        },
    ],
    page: {
        size: 1,
        number: 0,
        totalElements: 1,
        totalPages: 1,
    },
};

describe("SearchedSpotsList unit tests", () => {
    beforeEach(() => {
        useInfiniteQuery.mockReturnValue({
            data: {
                pages: [mockData],
                pageParams: [0],
            },
            isLoading: false,
            isError: false,
            isSuccess: true,
            hasNextPage: false,
            fetchNextPage: vi.fn(),
            isFetchingNextPage: false,
        });
        renderSearchedSpotsList();
    });

    test("Should render title", () => {
        expect(
            screen.getByText(/Spots matching criteria/i),
        ).toBeInTheDocument();
    });
    test("Should render modal close button", () => {
        expect(
            screen.getByTestId("search-spots-modal-close-btn"),
        ).toBeInTheDocument();
    });
    test("Should render searched spots sorting form", () => {
        expect(
            screen.getByTestId("searched-spots-sorting-form"),
        ).toBeInTheDocument();
    });
    describe("Should render spot info elements", () => {
        test("Should render first photo", () => {
            const firstPhoto = screen.getByAltText(
                `${mockData.content[0].name}Img`,
            );
            expect(firstPhoto).toBeInTheDocument();
            expect(firstPhoto).toHaveRole("img");
        });
        test("Should render spot name", () => {
            expect(
                screen.getByText(mockData.content[0].name),
            ).toBeInTheDocument();
        });
        test("Should render spot rating", () => {
            const ratingWrapper = screen.getByTestId("searched-spot-rating");

            const fullStars = ratingWrapper.querySelectorAll(
                ".ant-rate-star-full",
            );
            const halfStars = ratingWrapper.querySelectorAll(
                ".ant-rate-star-half",
            );
            const emptyStars = ratingWrapper.querySelectorAll(
                ".ant-rate-star.ant-rate-star-zero",
            );

            expect(fullStars.length).toBe(3);
            expect(halfStars.length).toBe(1);
            expect(emptyStars.length).toBe(1);
        });
        test("Should render spot rating count", () => {
            expect(
                screen.getByText(`(${mockData.content[0].ratingCount})`),
            ).toBeInTheDocument();
        });
        test("Should render tags", () => {
            expect(
                screen.getByText(mockData.content[0].tags[0].name),
            ).toBeInTheDocument();
            expect(
                screen.getByText(mockData.content[0].tags[1].name),
            ).toBeInTheDocument();
        });
    });
});
