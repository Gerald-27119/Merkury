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

const queryClient = new QueryClient();

vi.mock("@tanstack/react-query", async () => {
    return {
        ...(await vi.importActual("@tanstack/react-query")),
        useInfiniteQuery: vi.fn(),
    };
});

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
                    <Photos />
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

describe("Photos component unit tests", () => {
    describe("Photos display photos data correctly", () => {
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
            expect(screen.getByText(/photos/i)).toBeInTheDocument();
        });

        describe("Should display two date", () => {
            test("First date", () => {
                expect(screen.getByText("25.06.2025")).toBeInTheDocument();
            });
            test("First date", () => {
                expect(screen.getByText("24.06.2025")).toBeInTheDocument();
            });
        });

        test("Should render all photos", () => {
            const images = screen.getAllByTestId("user-photo");
            expect(images).toHaveLength(3);

            expect(images[0]).toHaveAttribute(
                "src",
                "https://example.com/photo1.jpg",
            );
            expect(images[1]).toHaveAttribute(
                "src",
                "https://example.com/photo2.jpg",
            );
            expect(images[2]).toHaveAttribute(
                "src",
                "https://example.com/photo3.jpg",
            );
        });
    });
});
