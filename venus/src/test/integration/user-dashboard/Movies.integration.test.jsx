import React from "react";
import { describe, test, beforeEach, vi, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { act } from "react";

import { accountSlice } from "../../../redux/account.tsx";
import Movies from "../../../pages/account/movies/Movies.tsx";
import { getSortedUserMovies } from "../../../http/user-dashboard";

vi.mock("react-player", () => ({
    __esModule: true,
    default: (props) => <div data-testid="user-movie" {...props} />,
}));

vi.mock("../../../http/user-dashboard", () => ({
    getSortedUserMovies: vi.fn(),
}));

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

const renderMovies = () => {
    const store = configureStore({
        reducer: {
            account: accountSlice.reducer,
        },
        preloadedState: {
            account: { isLogged: true },
        },
    });

    const queryClient = createTestQueryClient();

    return render(
        <Provider store={store}>
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <Movies />
                </QueryClientProvider>
            </MemoryRouter>
        </Provider>,
    );
};

let intersectionCallback = null;

class IntersectionObserverMock {
    constructor(callback) {
        intersectionCallback = callback;
    }

    observe() {}
    unobserve() {}
    disconnect() {}
}

beforeEach(() => {
    vi.clearAllMocks();
    // @ts-expect-error test env
    global.IntersectionObserver = IntersectionObserverMock;
    intersectionCallback = null;
});

const moviesFirstPage = {
    hasNext: false,
    items: [
        {
            date: "2025-06-25",
            media: [
                {
                    id: 1,
                    src: "movie-1.mp4",
                    heartsCount: 10,
                    viewsCount: 100,
                },
                {
                    id: 2,
                    src: "movie-2.mp4",
                    heartsCount: 5,
                    viewsCount: 50,
                },
            ],
        },
        {
            date: "2025-06-24",
            media: [
                {
                    id: 3,
                    src: "movie-3.mp4",
                    heartsCount: 2,
                    viewsCount: 20,
                },
            ],
        },
    ],
};

const moviesFirstPageHasNext = {
    hasNext: true,
    items: [
        {
            date: "2025-06-25",
            media: [
                {
                    id: 4,
                    src: "movie-4.mp4",
                    heartsCount: 7,
                    viewsCount: 70,
                },
            ],
        },
    ],
};

const moviesSecondPage = {
    hasNext: false,
    items: [
        {
            date: "2025-06-24",
            media: [
                {
                    id: 5,
                    src: "movie-5.mp4",
                    heartsCount: 3,
                    viewsCount: 30,
                },
            ],
        },
    ],
};

describe("Movies – integration tests", () => {
    test("renders data from API (first page) – title, dates, movies", async () => {
        getSortedUserMovies.mockResolvedValueOnce(moviesFirstPage);

        renderMovies();

        const movies = await screen.findAllByTestId("user-movie");
        expect(movies).toHaveLength(3);

        expect(screen.getByText("Movies")).toBeInTheDocument();

        expect(screen.getByText("25.06.2025")).toBeInTheDocument();
        expect(screen.getByText("24.06.2025")).toBeInTheDocument();

        expect(
            screen.queryByText("You haven't added any movies."),
        ).not.toBeInTheDocument();

        expect(getSortedUserMovies).toHaveBeenCalledTimes(1);
        const firstCallArgs = getSortedUserMovies.mock.calls[0];
        expect(firstCallArgs[3]).toBe(0);
        expect(firstCallArgs[4]).toBe(10);
    });

    test("shows empty state when API returns an empty list", async () => {
        getSortedUserMovies.mockResolvedValueOnce({
            hasNext: false,
            items: [],
        });

        renderMovies();

        expect(
            await screen.findByText("You haven't added any movies."),
        ).toBeInTheDocument();

        expect(getSortedUserMovies).toHaveBeenCalledTimes(1);
    });

    test("loads the next page after sentinel intersection (infinite scroll)", async () => {
        getSortedUserMovies
            .mockResolvedValueOnce(moviesFirstPageHasNext)
            .mockResolvedValueOnce(moviesSecondPage);

        renderMovies();

        await screen.findAllByTestId("user-movie");

        await act(async () => {
            if (intersectionCallback) {
                intersectionCallback([{ isIntersecting: true }]);
            }
        });

        await waitFor(() => {
            expect(getSortedUserMovies).toHaveBeenCalledTimes(2);
        });

        const secondCallArgs = getSortedUserMovies.mock.calls[1];
        expect(secondCallArgs[3]).toBe(1);
        expect(secondCallArgs[4]).toBe(10);
    });
});
