import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "../../../../redux/account";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi } from "vitest";
import FavoriteSpots from "../../../../pages/account/favorite-spots/FavoriteSpots";

const queryClient = new QueryClient();

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
                            country: "Spain",
                            city: "Barcelona",
                            description:
                                "Beautiful beach with golden sand and clear water.",
                            viewsCount: 1234,
                            rating: 4.5,
                            tags: [
                                { id: 1, name: "BeachTag" },
                                { id: 2, name: "SunnyTag" },
                            ],
                            imageUrl: "sunny_beach.jpg",
                        },
                        {
                            id: 2,
                            name: "Mountain Peak",
                            country: "Switzerland",
                            city: "Zermatt",
                            description:
                                "Breathtaking views from the top of the Alps.",
                            viewsCount: 987,
                            rating: 3.5,
                            tags: [
                                { id: 3, name: "MountainTag" },
                                { id: 4, name: "HikingTag" },
                            ],
                            imageUrl: "mountain_peak.jpg",
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

const renderFavoriteSpots = () => {
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
                    <FavoriteSpots />
                </QueryClientProvider>
            </MemoryRouter>
        </Provider>,
    );
};

describe("Favorite spots component unit tests", () => {
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
            renderFavoriteSpots();
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
                test("Render spot views count", () => {
                    expect(screen.getByText(/1234/i)).toBeInTheDocument();
                });
                test("Render spot tag 1", () => {
                    expect(screen.getByText(/BeachTag/i)).toBeInTheDocument();
                });
                test("Render spot tag 2", () => {
                    expect(screen.getByText(/SunnyTag/i)).toBeInTheDocument();
                });
                test("Render spot name", () => {
                    const images = screen.getAllByAltText("spotImage");
                    expect(images[0]?.getAttribute("src")).toBe(
                        "sunny_beach.jpg",
                    );
                });
                test("Render spot stars", () => {
                    const ratingWrapper = screen.getByTestId("spot-rating-1");

                    const fullStars = ratingWrapper.querySelectorAll(
                        ".ant-rate-star-full",
                    );
                    const halfStars = ratingWrapper.querySelectorAll(
                        ".ant-rate-star-half",
                    );

                    expect(fullStars.length).toBe(4);
                    expect(halfStars.length).toBe(1);
                });
            });
            describe("Second spot", () => {
                test("Render spot name", () => {
                    expect(
                        screen.getByText(/Mountain Peak/i),
                    ).toBeInTheDocument();
                });
                test("Render spot country", () => {
                    expect(
                        screen.getByText(/Switzerland/i),
                    ).toBeInTheDocument();
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
                test("Render spot views count", () => {
                    expect(screen.getByText(/987/i)).toBeInTheDocument();
                });
                test("Render spot tag 1", () => {
                    expect(
                        screen.getByText(/MountainTag/i),
                    ).toBeInTheDocument();
                });
                test("Render spot tag 2", () => {
                    expect(screen.getByText(/HikingTag/i)).toBeInTheDocument();
                });
                test("Render spot image", () => {
                    const images = screen.getAllByAltText("spotImage");
                    expect(images[1]?.getAttribute("src")).toBe(
                        "mountain_peak.jpg",
                    );
                });
                test("Render spot stars", () => {
                    const ratingWrapper = screen.getByTestId("spot-rating-2");

                    const fullStars = ratingWrapper.querySelectorAll(
                        ".ant-rate-star-full",
                    );
                    const halfStars = ratingWrapper.querySelectorAll(
                        ".ant-rate-star-half",
                    );

                    expect(fullStars.length).toBe(3);
                    expect(halfStars.length).toBe(1);
                });
            });
        });

        describe("Should render menu buttons text", () => {
            test("All", () => {
                expect(screen.getByText(/all/i)).toBeInTheDocument();
            });
            test("Favorites", () => {
                expect(screen.getByText(/favorites/i)).toBeInTheDocument();
            });
            test("Plan to visit", () => {
                expect(screen.getByText(/plan to visit/i)).toBeInTheDocument();
            });
            test("Visited liked it", () => {
                expect(
                    screen.getByText(/visited liked it/i),
                ).toBeInTheDocument();
            });
            test("Visited didn't liked it", () => {
                expect(
                    screen.getByText(/visited didn't like it/i),
                ).toBeInTheDocument();
            });
        });

        test("Should render h1 text", () => {
            expect(screen.getByText(/spots list/i)).toBeInTheDocument();
        });
    });
});
