import React from "react";
import { describe, test, beforeEach, vi, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { act } from "react";
import userEvent from "@testing-library/user-event";

import { accountSlice } from "../../../redux/account.tsx";
import FavoriteSpots from "../../../pages/account/favorite-spots/FavoriteSpots.tsx";
import { getUserFavoriteSpots } from "../../../http/user-dashboard.ts";

vi.mock("../../../http/user-dashboard.ts", () => ({
    getUserFavoriteSpots: vi.fn(),
    editFavoriteSpotList: vi.fn(),
}));

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

const renderFavoriteSpots = () => {
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
                    <FavoriteSpots />
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
    global.IntersectionObserver = IntersectionObserverMock;
    intersectionCallback = null;
});

const firstPage = {
    hasNext: false,
    items: [
        {
            id: 1,
            name: "First spot",
            city: "City A",
            country: "Country A",
            viewsCount: 10,
            rating: 4.5,
            tags: [
                { id: 1, name: "tag1" },
                { id: 2, name: "tag2" },
            ],
            description: "Description 1",
            imageUrl: "image-1.jpg",
            coords: { lat: 0, lng: 0 },
            type: "ALL",
        },
        {
            id: 2,
            name: "Second spot",
            city: "City B",
            country: "Country B",
            viewsCount: 20,
            rating: 3.5,
            tags: [{ id: 3, name: "tag3" }],
            description: "Description 2",
            imageUrl: "image-2.jpg",
            coords: { lat: 1, lng: 1 },
            type: "ALL",
        },
    ],
};

const favoritesPage = {
    hasNext: false,
    items: [
        {
            id: 3,
            name: "Favorite spot",
            city: "Fav City",
            country: "Fav Country",
            viewsCount: 5,
            rating: 5,
            tags: [{ id: 4, name: "fav-tag" }],
            description: "Favorite description",
            imageUrl: "image-3.jpg",
            coords: { lat: 2, lng: 2 },
            type: "FAVORITE",
        },
    ],
};

const firstPageHasNext = {
    hasNext: true,
    items: [
        {
            id: 4,
            name: "Page 1 spot",
            city: "City C",
            country: "Country C",
            viewsCount: 30,
            rating: 4,
            tags: [{ id: 5, name: "page1-tag" }],
            description: "Page 1 description",
            imageUrl: "image-4.jpg",
            coords: { lat: 3, lng: 3 },
            type: "ALL",
        },
    ],
};

const secondPage = {
    hasNext: false,
    items: [
        {
            id: 5,
            name: "Page 2 spot",
            city: "City D",
            country: "Country D",
            viewsCount: 40,
            rating: 2.5,
            tags: [{ id: 6, name: "page2-tag" }],
            description: "Page 2 description",
            imageUrl: "image-5.jpg",
            coords: { lat: 4, lng: 4 },
            type: "ALL",
        },
    ],
};

describe("FavoriteSpots – integration tests", () => {
    test("renders data from API (first page) – title, spots, description, location", async () => {
        getUserFavoriteSpots.mockResolvedValueOnce(firstPage);

        renderFavoriteSpots();

        expect(await screen.findByText("First spot")).toBeInTheDocument();

        expect(screen.getByText("spots lists")).toBeInTheDocument();

        expect(screen.getByText("Second spot")).toBeInTheDocument();

        expect(screen.getByText("Description 1")).toBeInTheDocument();
        expect(screen.getByText("Description 2")).toBeInTheDocument();

        expect(screen.getByText("City A, Country A")).toBeInTheDocument();
        expect(screen.getByText("City B, Country B")).toBeInTheDocument();

        expect(
            screen.queryByText("You don't have any spots in your list."),
        ).not.toBeInTheDocument();

        expect(getUserFavoriteSpots).toHaveBeenCalledTimes(1);
        const firstCallArgs = getUserFavoriteSpots.mock.calls[0];
        expect(firstCallArgs[1]).toBe(0);
        expect(firstCallArgs[2]).toBe(10);
    });

    test("refetches and renders new list when menu type changes", async () => {
        getUserFavoriteSpots
            .mockResolvedValueOnce(firstPage)
            .mockResolvedValueOnce(favoritesPage);

        renderFavoriteSpots();

        expect(await screen.findByText("First spot")).toBeInTheDocument();

        const user = userEvent.setup();
        const favoritesButton = screen.getByRole("button", {
            name: "Favorites",
        });

        await user.click(favoritesButton);

        expect(await screen.findByText("Favorite spot")).toBeInTheDocument();
        expect(screen.queryByText("First spot")).not.toBeInTheDocument();
        expect(screen.queryByText("Second spot")).not.toBeInTheDocument();

        expect(getUserFavoriteSpots).toHaveBeenCalledTimes(2);
    });

    test("shows empty state when API returns an empty list", async () => {
        getUserFavoriteSpots.mockResolvedValueOnce({
            hasNext: false,
            items: [],
        });

        renderFavoriteSpots();

        expect(
            await screen.findByText("You don't have any spots in your list."),
        ).toBeInTheDocument();

        expect(getUserFavoriteSpots).toHaveBeenCalledTimes(1);
    });

    test("loads the next page after sentinel intersection (infinite scroll)", async () => {
        getUserFavoriteSpots
            .mockResolvedValueOnce(firstPageHasNext)
            .mockResolvedValueOnce(secondPage);

        renderFavoriteSpots();

        expect(await screen.findByText("Page 1 spot")).toBeInTheDocument();

        await act(async () => {
            if (intersectionCallback) {
                intersectionCallback([{ isIntersecting: true }]);
            }
        });

        expect(await screen.findByText("Page 2 spot")).toBeInTheDocument();

        expect(getUserFavoriteSpots).toHaveBeenCalledTimes(2);
        const secondCallArgs = getUserFavoriteSpots.mock.calls[1];
        expect(secondCallArgs[1]).toBe(1);
        expect(secondCallArgs[2]).toBe(10);
    });
});
