import {
    QueryClient,
    QueryClientProvider,
    useInfiniteQuery,
} from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { sidebarSlice } from "../../redux/sidebar.js";
import { currentViewSpotsSlice } from "../../redux/current-view-spots.js";
import { currentViewSpotsListModalSlice } from "../../redux/current-view-spots-list-modal.js";
import { currentViewSpotParamsSlice } from "../../redux/current-view-spot-params.js";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import CurrentViewSpotsList from "../../pages/spot/components/current-view-spots/CurrentViewSpotsList.js";

const queryClient = new QueryClient();

vi.mock("@tanstack/react-query", async () => {
    return {
        ...(await vi.importActual("@tanstack/react-query")),
        useInfiniteQuery: vi.fn(),
    };
});

const renderCurrentViewSpotsList = () => {
    const store = configureStore({
        reducer: {
            sidebar: sidebarSlice.reducer,
            currentViewSpots: currentViewSpotsSlice.reducer,
            currentViewSpotsListModal: currentViewSpotsListModalSlice.reducer,
            currentViewSpotsParams: currentViewSpotParamsSlice.reducer,
        },
        preloadedState: {
            currentViewSpots: currentViewSpotsSlice.getInitialState(),
            currentViewSpotsParams: {
                name: "",
                sorting: "none",
                ratingFrom: 0.0,
                swLng: 0,
                swLat: 0,
                neLng: 0,
                neLat: 0,
            },
            currentViewSpotsListModal: {
                showList: true,
            },
            sidebar: {
                isOpen: false,
            },
        },
    });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <CurrentViewSpotsList />
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

describe("CurrentViewSpotsList component unit tests", () => {
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
        renderCurrentViewSpotsList();
    });
    test("Should render close button", () => {
        expect(screen.getByTestId("current-view-spots-modal-close-btn"));
    });
    test("Should render title", () => {
        expect(screen.getByText(/nearby spots/i)).toBeInTheDocument();
    });
    describe("Should render name search bar", () => {
        test("Should render form", () => {
            const form = screen.getByTestId(
                "current-view-spots-name-search-bar",
            );
            expect(form).toBeInTheDocument();
            expect(form).toHaveRole("form");
        });
        test("Should render input field with text", () => {
            const inputField = screen.getByText(/search on map/i);
            expect(inputField).toBeInTheDocument();
            expect(inputField).toHaveRole("textbox");
        });
        test("Should render search icon", () => {
            expect(screen.getByTestId("search-icon")).toBeInTheDocument();
        });
    });
    describe("Should render sorting form", () => {
        test("Should render form", () => {
            expect(
                screen.getByTestId("searched-spots-sorting-form"),
            ).toBeInTheDocument();
        });
        test("Should render title", () => {
            expect(screen.getByText(/sort:/i)).toBeInTheDocument();
        });
        test("Should render default value", () => {
            const defaultSoringValue = screen.getByTestId("sorting-value");
            expect(defaultSoringValue).toBeInTheDocument();
            expect(defaultSoringValue).toHaveTextContent(/default/i);
        });
        test("Should render arrow that opens menu", () => {
            expect(
                screen.getByTestId("searched-spots-sorting-arrow"),
            ).toBeInTheDocument();
        });
    });
    describe("Should render rating from form", () => {
        test("Should render title", () => {
            expect(screen.getByText(/rating from:/i)).toBeInTheDocument();
        });
        test("Should render rating input with default 0 value", () => {
            const ratingWrapper = screen.getByTestId(
                "current-view-spots-rating-from-form",
            );

            const fullStars = ratingWrapper.querySelectorAll(
                ".ant-rate-star-full",
            );
            const halfStars = ratingWrapper.querySelectorAll(
                ".ant-rate-star-half",
            );
            const emptyStars = ratingWrapper.querySelectorAll(
                ".ant-rate-star.ant-rate-star-zero",
            );

            expect(fullStars.length).toBe(0);
            expect(halfStars.length).toBe(0);
            expect(emptyStars.length).toBe(5);
        });
    });
});
