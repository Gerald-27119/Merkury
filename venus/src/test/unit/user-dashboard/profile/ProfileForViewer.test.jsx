import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "../../../../redux/account";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe } from "vitest";
import ProfileForViewer from "../../../../pages/account/profile/ProfileForViewer";

const queryClient = new QueryClient();

vi.mock("@tanstack/react-query", async () => {
    return {
        ...(await vi.importActual("@tanstack/react-query")),
        useQuery: vi.fn(),
    };
});

const renderProfile = () => {
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
                    <ProfileForViewer />
                </QueryClientProvider>
            </MemoryRouter>
        </Provider>,
    );
};

const mockUserData = (isFriends, isFollowing) => ({
    profile: {
        username: "User",
        profilePhoto: "mock-photo.jpg",
        followersCount: 1,
        followedCount: 6,
        friendsCount: 5,
        photosCount: 29,
        mostPopularPhotos: [
            {
                id: 1,
                src: "photo1.jpg",
                heartsCount: 0,
                viewsCount: 0,
                title: "Statue A",
            },
            {
                id: 2,
                src: "photo2.jpg",
                heartsCount: 0,
                viewsCount: 0,
                title: "Statue B",
            },
        ],
    },
    isFriends,
    isFollowing,
    isOwnProfile: false,
});

describe("Profile for viewer component unit tests", () => {
    describe("Profile for viewer display user data correctly", () => {
        beforeEach(() => {
            useQuery.mockReturnValue({
                data: mockUserData(false, false),
                isLoading: false,
                error: null,
            });
            renderProfile();
        });
        test("Should render username", () => {
            expect(screen.getByText("User")).toBeInTheDocument();
        });
        test("Should render profile photo", () => {
            expect(
                screen.getByAltText("profileImage")?.getAttribute("src"),
            ).toBe("mock-photo.jpg");
        });
        describe("Should render followers count", () => {
            test("Text", () => {
                expect(screen.getByText("Followers")).toBeInTheDocument();
            });
            test("Number", () => {
                expect(screen.getByText("1")).toBeInTheDocument();
            });
        });
        describe("Should render followed count", () => {
            test("Text", () => {
                expect(screen.getByText("Followed")).toBeInTheDocument();
            });
            test("Number", () => {
                expect(screen.getByText("6")).toBeInTheDocument();
            });
        });
        describe("Should render friends count", () => {
            test("Text", () => {
                expect(screen.getByText("Friends")).toBeInTheDocument();
            });
            test("Number", () => {
                expect(screen.getByText("5")).toBeInTheDocument();
            });
        });
        describe("Should render photos count", () => {
            test("Text", () => {
                expect(screen.getByText("Photos")).toBeInTheDocument();
            });
            test("Number", () => {
                expect(screen.getByText("29")).toBeInTheDocument();
            });
        });
        test("Should render most popular photos", () => {
            expect(screen.getByAltText("Statue A")).toBeInTheDocument();
        });
        describe("Should render buttons", () => {
            describe("When isNotFriends and isNotFollowing", () => {
                test("To follow", () => {
                    expect(screen.getByText("follow")).toBeInTheDocument();
                });
                test("Add to friends", () => {
                    expect(
                        screen.getByText("add to friends"),
                    ).toBeInTheDocument();
                });
            });
            describe("When isFriends and isFollowing", () => {
                beforeEach(() => {
                    useQuery.mockReturnValue({
                        data: mockUserData(true, true),
                        isLoading: false,
                        error: null,
                    });
                    renderProfile();
                });
                test("Remove from friends", () => {
                    expect(
                        screen.getByText("remove from friends"),
                    ).toBeInTheDocument();
                });
                test("To unfollow", () => {
                    expect(screen.getByText("unfollow")).toBeInTheDocument();
                });
            });
        });
    });
});
