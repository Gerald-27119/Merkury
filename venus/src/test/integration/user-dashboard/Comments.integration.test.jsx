import React from "react";
import { describe, test, beforeEach, vi, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { act } from "react";
import { accountSlice } from "../../../redux/account.tsx";
import Comments from "../../../pages/account/comments/Comments.tsx";
import { getAllUserComments } from "../../../http/user-dashboard.ts";

vi.mock("../../../http/user-dashboard.ts", () => ({
    getAllUserComments: vi.fn(),
}));

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

const renderComments = () => {
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
                    <Comments />
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
            date: "2025-06-25",
            spotName: "spot name 1",
            comments: [
                {
                    id: 1,
                    text: "comment text 1",
                    addTime: "2025-06-25",
                },
                {
                    id: 2,
                    text: "comment text 2",
                    addTime: "2025-06-25",
                },
            ],
        },
        {
            date: "2025-06-24",
            spotName: "spot name 2",
            comments: [
                {
                    id: 3,
                    text: "comment text 3",
                    addTime: "2025-06-24",
                },
            ],
        },
    ],
};

const firstPageHasNext = {
    hasNext: true,
    items: [
        {
            date: "2025-06-25",
            spotName: "spot 1",
            comments: [
                {
                    id: 1,
                    text: "page 1 comment",
                    addTime: "2025-06-25",
                },
            ],
        },
    ],
};

const secondPage = {
    hasNext: false,
    items: [
        {
            date: "2025-06-24",
            spotName: "spot 2",
            comments: [
                {
                    id: 2,
                    text: "page 2 comment",
                    addTime: "2025-06-24",
                },
            ],
        },
    ],
};

describe("Comments – integration tests", () => {
    test("renders data from API (first page) – title, dates, comments, spot names", async () => {
        getAllUserComments.mockResolvedValueOnce(firstPage);

        renderComments();

        expect(await screen.findByText("comment text 1")).toBeInTheDocument();

        expect(screen.getByText("Comments")).toBeInTheDocument();

        expect(screen.getByText("25.06.2025")).toBeInTheDocument();
        expect(screen.getByText("24.06.2025")).toBeInTheDocument();

        expect(screen.getByText("comment text 1")).toBeInTheDocument();
        expect(screen.getByText("comment text 2")).toBeInTheDocument();
        expect(screen.getByText("comment text 3")).toBeInTheDocument();

        expect(screen.getByText("spot name 1")).toBeInTheDocument();
        expect(screen.getByText("spot name 2")).toBeInTheDocument();

        expect(
            screen.queryByText("You haven't added any comments."),
        ).not.toBeInTheDocument();

        expect(getAllUserComments).toHaveBeenCalledTimes(1);
    });

    test("shows empty state when API returns an empty list", async () => {
        getAllUserComments.mockResolvedValueOnce({
            hasNext: false,
            items: [],
        });

        renderComments();

        expect(
            await screen.findByText("You haven't added any comments."),
        ).toBeInTheDocument();

        expect(getAllUserComments).toHaveBeenCalledTimes(1);
    });

    test("loads the next page after sentinel intersection (infinite scroll)", async () => {
        getAllUserComments
            .mockResolvedValueOnce(firstPageHasNext)
            .mockResolvedValueOnce(secondPage);

        renderComments();

        expect(await screen.findByText("page 1 comment")).toBeInTheDocument();

        await act(async () => {
            intersectionCallback &&
                intersectionCallback([{ isIntersecting: true }]);
        });

        expect(await screen.findByText("page 2 comment")).toBeInTheDocument();

        expect(getAllUserComments).toHaveBeenCalledTimes(2);

        const secondCallArgs = getAllUserComments.mock.calls[1];
        expect(secondCallArgs[3]).toBe(1);
    });
});
