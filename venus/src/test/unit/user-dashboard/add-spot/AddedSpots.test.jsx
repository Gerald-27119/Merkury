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
import { describe, test, expect, vi } from "vitest";
import AddedSpot from "../../../../pages/account/add-spot/AddedSpot.tsx";

const queryClient = new QueryClient();

vi.mock("../../../../pages/account/add-spot/components/SpotMap", () => ({
    default: () => <div data-testid="spot-map" />,
}));

vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual("@tanstack/react-query");
    const mockData = {
        data: {
            pages: [
                {
                    items: [
                        {
                            id: 1,
                            name: "Sunny Beach",
                            description:
                                "Beautiful beach with golden sand and clear water.",
                            country: "Spain",
                            region: "Catalonia",
                            city: "Barcelona",
                            street: "Passeig Marítim 1",
                            borderPoints: [
                                { x: 2.1903, y: 41.387 },
                                { x: 2.191, y: 41.3875 },
                                { x: 2.1895, y: 41.3865 },
                            ],
                            firstPhotoUrl: "sunny_beach.jpg",
                        },
                        {
                            id: 2,
                            name: "Mountain Peak",
                            description:
                                "Breathtaking views from the top of the Alps.",
                            country: "Switzerland",
                            region: "Valais",
                            city: "Zermatt",
                            street: "Bergstrasse 5",
                            borderPoints: [
                                { x: 7.749, y: 46.02 },
                                { x: 7.75, y: 46.021 },
                                { x: 7.748, y: 46.019 },
                            ],
                            firstPhotoUrl: "mountain_peak.jpg",
                        },
                    ],
                    hasNext: false,
                },
            ],
            pageParams: [0],
        },
        isLoading: false,
        hasNextPage: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
    };

    return {
        ...actual,
        useInfiniteQuery: vi.fn().mockReturnValue(mockData),
    };
});

const renderAddedSpots = () => {
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
                    <AddedSpot />
                </QueryClientProvider>
            </MemoryRouter>
        </Provider>,
    );
};

describe("Added spots component unit tests", () => {
    describe("Spots display data correctly", () => {
        beforeEach(() => {
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
            renderAddedSpots();
        });

        describe("Should render all spots correctly", () => {
            describe("First spot", () => {
                test("Render spot name", () => {
                    expect(
                        screen.getByText(/Sunny Beach/i),
                    ).toBeInTheDocument();
                });
                test("Render spot country", () => {
                    expect(screen.getByText(/Spain/i)).toBeInTheDocument();
                });
                test("Render spot city", () => {
                    expect(screen.getByText(/Barcelona/i)).toBeInTheDocument();
                });
                test("Render spot description", () => {
                    expect(
                        screen.getByText(
                            /Beautiful beach with golden sand and clear water./i,
                        ),
                    ).toBeInTheDocument();
                });
                test("Render spot street", () => {
                    expect(
                        screen.getByText(/Passeig Marítim 1/i),
                    ).toBeInTheDocument();
                });
                test("Render spot image", () => {
                    const images = screen.getAllByAltText("spot-image");
                    expect(images[0]?.getAttribute("src")).toBe(
                        "sunny_beach.jpg",
                    );
                });
            });
        });

        describe("Second spot", () => {
            test("Render spot name", () => {
                expect(screen.getByText(/Mountain Peak/i)).toBeInTheDocument();
            });
            test("Render spot country", () => {
                expect(screen.getByText(/Switzerland/i)).toBeInTheDocument();
            });
            test("Render spot city", () => {
                expect(screen.getByText(/Zermatt/i)).toBeInTheDocument();
            });
            test("Render spot description", () => {
                expect(
                    screen.getByText(
                        /Breathtaking views from the top of the Alps./i,
                    ),
                ).toBeInTheDocument();
            });
            test("Render spot street", () => {
                expect(screen.getByText(/Bergstrasse 5/i)).toBeInTheDocument();
            });
            test("Render spot image", () => {
                const images = screen.getAllByAltText("spot-image");
                expect(images[1]?.getAttribute("src")).toBe(
                    "mountain_peak.jpg",
                );
            });
        });

        describe("Should render menu buttons text", () => {
            test("Add spot", () => {
                const button = screen.getByRole("button", {
                    name: /add spot/i,
                });

                expect(button).toBeInTheDocument();
            });
        });

        test("Should render h1 text", () => {
            expect(screen.getByTestId("Add spot")).toBeInTheDocument();
        });
    });

    test("shows empty state when user has no spots", () => {
        useInfiniteQuery.mockReturnValueOnce({
            data: {
                pages: [{ items: [], hasNext: false }],
                pageParams: [0],
            },
            isLoading: false,
            hasNextPage: false,
            fetchNextPage: vi.fn(),
            isFetchingNextPage: false,
        });

        renderAddedSpots();

        expect(
            screen.getByText(/You haven't added any spots yet./i),
        ).toBeInTheDocument();
    });
});
