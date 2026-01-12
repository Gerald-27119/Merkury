import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "../../../../redux/account";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe } from "vitest";
import { SocialListType } from "../../../../model/enum/account/social/socialListType";
import { socialSlice } from "../../../../redux/social";
import UserOwnSocial from "../../../../pages/account/social/UserOwnSocial";

const queryClient = new QueryClient();

vi.mock("@tanstack/react-query", async () => {
    const mockFriendsData = [
        {
            username: "User 1",
            profilePhoto: "user1.jpg",
        },
        {
            username: "User 2",
            profilePhoto: "user2.jpg",
        },
        {
            username: "User 3",
            profilePhoto: "user3.jpg",
        },
        {
            username: "User 4",
            profilePhoto: "user4.jpg",
        },
        {
            username: "User 5",
            profilePhoto: "user5.jpg",
        },
    ];

    return {
        ...(await vi.importActual("@tanstack/react-query")),
        useInfiniteQuery: vi.fn().mockReturnValue({
            data: {
                pages: [
                    {
                        items: mockFriendsData,
                        hasNext: false,
                    },
                ],
                pageParams: [0],
            },
            isLoading: false,
            error: null,
            hasNextPage: false,
            fetchNextPage: vi.fn(),
            isFetchingNextPage: false,
        }),
    };
});

const renderSocial = () => {
    const store = configureStore({
        reducer: {
            account: accountSlice.reducer,
            social: socialSlice.reducer,
        },
        account: {
            isLogged: true,
        },
        social: {
            type: SocialListType.FRIENDS,
        },
    });

    render(
        <Provider store={store}>
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <UserOwnSocial />
                </QueryClientProvider>
            </MemoryRouter>
        </Provider>,
    );
};

describe("Social component unit tests", () => {
    describe("Social display friends data correctly", () => {
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
            renderSocial();
        });

        describe("Should render all friend cards", () => {
            describe("Should render first user friend card", () => {
                test("Should render username", () => {
                    expect(screen.getByText("User 1")).toBeInTheDocument();
                });
                test("Should render profile photo", () => {
                    const images = screen.getAllByAltText("profileImage");
                    expect(images[0]?.getAttribute("src")).toBe("user1.jpg");
                });
            });

            describe("Should render second user friend card", () => {
                test("Should render username", () => {
                    expect(screen.getByText("User 2")).toBeInTheDocument();
                });
                test("Should render profile photo", () => {
                    const images = screen.getAllByAltText("profileImage");
                    expect(images[1]?.getAttribute("src")).toBe("user2.jpg");
                });
            });

            describe("Should render third user friend card", () => {
                test("Should render username", () => {
                    expect(screen.getByText("User 3")).toBeInTheDocument();
                });
                test("Should render profile photo", () => {
                    const images = screen.getAllByAltText("profileImage");
                    expect(images[2]?.getAttribute("src")).toBe("user3.jpg");
                });
            });

            describe("Should render fourth user friend card", () => {
                test("Should render username", () => {
                    expect(screen.getByText("User 4")).toBeInTheDocument();
                });
                test("Should render profile photo", () => {
                    const images = screen.getAllByAltText("profileImage");
                    expect(images[3]?.getAttribute("src")).toBe("user4.jpg");
                });
            });

            describe("Should render fifth user friend card", () => {
                test("Should render username", () => {
                    expect(screen.getByText("User 5")).toBeInTheDocument();
                });
                test("Should render profile photo", () => {
                    const images = screen.getAllByAltText("profileImage");
                    expect(images[4]?.getAttribute("src")).toBe("user5.jpg");
                });
            });
        });

        describe("Should render menu buttons text", () => {
            test("Friends", () => {
                expect(screen.getByText("friends")).toBeInTheDocument();
            });
            test("Followed", () => {
                expect(screen.getByText("followed")).toBeInTheDocument();
            });
            test("Followers", () => {
                expect(screen.getByText("followers")).toBeInTheDocument();
            });
        });

        test("Should render h1 text", () => {
            expect(screen.getByText("social list")).toBeInTheDocument();
        });
    });
});
