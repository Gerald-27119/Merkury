import {
    QueryClient,
    QueryClientProvider,
    useInfiniteQuery,
} from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "../../../../redux/account";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe } from "vitest";
import { act } from "react";
import Comments from "../../../../pages/account/comments/Comments.tsx";

const queryClient = new QueryClient();

vi.mock("@tanstack/react-query", async () => {
    return {
        ...(await vi.importActual("@tanstack/react-query")),
        useInfiniteQuery: vi.fn(),
    };
});

const renderComments = () => {
    const store = configureStore({
        reducer: {
            account: accountSlice.reducer,
        },
        account: {
            isLogged: true,
        },
    });

    render(
        <Provider store={store}>
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <Comments />
                </QueryClientProvider>
            </MemoryRouter>
        </Provider>,
    );
};

const mockCommentsData = [
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
];

describe("Comments component unit tests", () => {
    describe("Comments display comments data correctly", () => {
        beforeEach(async () => {
            global.IntersectionObserver = class {
                constructor(callback) {
                    this.callback = callback;
                }
                observe() {
                    this.callback([{ isIntersecting: true }]);
                }
                unobserve() {}
                disconnect() {}
            };
            useInfiniteQuery.mockReturnValue({
                data: {
                    pages: [
                        {
                            items: mockCommentsData,
                            hasNext: false,
                        },
                    ],
                    pageParams: [0],
                },
                isLoading: false,
                hasNextPage: false,
                fetchNextPage: vi.fn(),
                isFetchingNextPage: false,
            });

            await act(async () => {
                renderComments();
            });
        });

        test("Should render h1 text", () => {
            expect(screen.getByText("Comments")).toBeInTheDocument();
        });

        describe("Should display two dates", () => {
            test("First date", () => {
                expect(screen.getByText("25.06.2025")).toBeInTheDocument();
            });
            test("Second date", () => {
                expect(screen.getByText("24.06.2025")).toBeInTheDocument();
            });
        });

        test("Should render all comments and match data", () => {
            const comments = screen.getAllByTestId("comment");
            expect(comments).toHaveLength(3);

            expect(screen.getByText("comment text 1")).toBeInTheDocument();
            expect(screen.getByText("comment text 2")).toBeInTheDocument();
            expect(screen.getByText("comment text 3")).toBeInTheDocument();

            expect(screen.getByText("spot name 1")).toBeInTheDocument();
            expect(screen.getByText("spot name 2")).toBeInTheDocument();
        });
    });
});
