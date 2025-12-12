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
import Photos from "../../../pages/account/photos/Photos.tsx";
import { getSortedUserPhotos } from "../../../http/user-dashboard";

vi.mock("../../../http/user-dashboard", () => ({
    getSortedUserPhotos: vi.fn(),
}));

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

const renderPhotos = () => {
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
                    <Photos />
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

const photosFirstPage = {
    hasNext: false,
    items: [
        {
            date: "2025-06-25",
            media: [
                {
                    id: 1,
                    src: "photo-1.jpg",
                    heartsCount: 10,
                    viewsCount: 100,
                },
                {
                    id: 2,
                    src: "photo-2.jpg",
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
                    src: "photo-3.jpg",
                    heartsCount: 2,
                    viewsCount: 20,
                },
            ],
        },
    ],
};

const photosFirstPageHasNext = {
    hasNext: true,
    items: [
        {
            date: "2025-06-25",
            media: [
                {
                    id: 4,
                    src: "photo-4.jpg",
                    heartsCount: 7,
                    viewsCount: 70,
                },
            ],
        },
    ],
};

const photosSecondPage = {
    hasNext: false,
    items: [
        {
            date: "2025-06-24",
            media: [
                {
                    id: 5,
                    src: "photo-5.jpg",
                    heartsCount: 3,
                    viewsCount: 30,
                },
            ],
        },
    ],
};

describe("Photos – integration tests", () => {
    test("renders data from API (first page) – title, dates, photos", async () => {
        getSortedUserPhotos.mockResolvedValueOnce(photosFirstPage);

        renderPhotos();

        const photos = await screen.findAllByTestId("user-photo");
        expect(photos).toHaveLength(3);

        expect(screen.getByText("Photos")).toBeInTheDocument();

        expect(screen.getByText("25.06.2025")).toBeInTheDocument();
        expect(screen.getByText("24.06.2025")).toBeInTheDocument();

        expect(
            screen.queryByText("You haven't added any photos."),
        ).not.toBeInTheDocument();

        expect(getSortedUserPhotos).toHaveBeenCalledTimes(1);
        const firstCallArgs = getSortedUserPhotos.mock.calls[0];
        expect(firstCallArgs[3]).toBe(0);
        expect(firstCallArgs[4]).toBe(2);
    });

    test("shows empty state when API returns an empty list", async () => {
        getSortedUserPhotos.mockResolvedValueOnce({
            hasNext: false,
            items: [],
        });

        renderPhotos();

        expect(
            await screen.findByText("You haven't added any photos."),
        ).toBeInTheDocument();

        expect(getSortedUserPhotos).toHaveBeenCalledTimes(1);
    });

    test("loads the next page after sentinel intersection (infinite scroll)", async () => {
        getSortedUserPhotos
            .mockResolvedValueOnce(photosFirstPageHasNext)
            .mockResolvedValueOnce(photosSecondPage);

        renderPhotos();

        await screen.findAllByTestId("user-photo");

        await act(async () => {
            if (intersectionCallback) {
                intersectionCallback([{ isIntersecting: true }]);
            }
        });

        await waitFor(() => {
            expect(getSortedUserPhotos).toHaveBeenCalledTimes(2);
        });

        const secondCallArgs = getSortedUserPhotos.mock.calls[1];
        expect(secondCallArgs[3]).toBe(1);
        expect(secondCallArgs[4]).toBe(2);
    });
});
