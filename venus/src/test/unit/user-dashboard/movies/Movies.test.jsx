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
import Photos from "../../../../pages/account/photos/Photos";
import { act } from "react";
import Movies from "../../../../pages/account/movies/Movies.tsx";

const queryClient = new QueryClient();

vi.mock("@tanstack/react-query", async () => {
    return {
        ...(await vi.importActual("@tanstack/react-query")),
        useInfiniteQuery: vi.fn(),
    };
});

vi.mock("react-player", () => ({
    __esModule: true,
    default: vi.fn((props) => (
        <div data-testid="user-movie" {...props}>
            Mocked ReactPlayer
        </div>
    )),
}));

const renderPhotos = () => {
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
                    <Movies />
                </QueryClientProvider>
            </MemoryRouter>
        </Provider>,
    );
};

const mockPhotosData = [
    {
        date: "2025-06-25",
        media: [
            {
                id: 1,
                src: "https://example.com/photo1.jpg",
                heartsCount: 10,
                viewsCount: 100,
                addDate: "2025-06-25",
            },
            {
                id: 2,
                src: "https://example.com/photo2.jpg",
                heartsCount: 5,
                viewsCount: 80,
                addDate: "2025-06-25",
            },
        ],
    },
    {
        date: "2025-06-24",
        media: [
            {
                id: 3,
                src: "https://example.com/photo3.jpg",
                heartsCount: 8,
                viewsCount: 90,
                addDate: "2025-06-24",
            },
        ],
    },
];

describe("Movies component unit tests", () => {
    describe("Movies display Movies data correctly", () => {
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
                            items: mockPhotosData,
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
                renderPhotos();
            });
        });

        test("Should render h1 text", () => {
            expect(screen.getByText(/movies/i)).toBeInTheDocument();
        });

        describe("Should display two date", () => {
            test("First date", () => {
                expect(screen.getByText("25.06.2025")).toBeInTheDocument();
            });
            test("First date", () => {
                expect(screen.getByText("24.06.2025")).toBeInTheDocument();
            });
        });

        test("Should render all movies", () => {
            const movies = screen.getAllByTestId("user-movie");
            expect(movies).toHaveLength(3);

            expect(movies[0]).toHaveAttribute(
                "src",
                "https://example.com/photo1.jpg",
            );
            expect(movies[1]).toHaveAttribute(
                "src",
                "https://example.com/photo2.jpg",
            );
            expect(movies[2]).toHaveAttribute(
                "src",
                "https://example.com/photo3.jpg",
            );
        });
    });
});
