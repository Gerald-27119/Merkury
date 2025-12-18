import React, { act } from "react";
import { describe, test, beforeEach, vi, expect } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { Provider as ReduxProvider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { accountSlice } from "../../../redux/account.tsx";
import UserOwnProfile from "../../../pages/account/profile/UserOwnProfile.tsx";
import ProfileForViewer from "../../../pages/account/profile/ProfileForViewer.tsx";
import {
    getUserOwnProfile,
    getProfileForViewer,
    changeUserProfilePhoto,
    editUserFriends,
    editUserFollowed,
    changeUserFriendsStatus,
} from "../../../http/user-dashboard";
import { UserFriendStatus } from "../../../model/enum/account/social/userFriendStatus";

vi.mock("../../../http/user-dashboard", () => ({
    getUserOwnProfile: vi.fn(),
    getProfileForViewer: vi.fn(),
    changeUserProfilePhoto: vi.fn(),
    changeUserFriendsStatus: vi.fn(),
    editUserFriends: vi.fn(),
    editUserFollowed: vi.fn(),
}));

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

const createTestStore = () =>
    configureStore({
        reducer: {
            account: accountSlice.reducer,
        },
        preloadedState: {
            account: { isLogged: true },
        },
    });

const renderUserOwnProfile = () => {
    const store = createTestStore();
    const queryClient = createTestQueryClient();

    return render(
        <ReduxProvider store={store}>
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <UserOwnProfile />
                </QueryClientProvider>
            </MemoryRouter>
        </ReduxProvider>,
    );
};

const renderProfileForViewer = (path = "/account/profile/otherUser") => {
    const store = createTestStore();
    const queryClient = createTestQueryClient();

    return render(
        <ReduxProvider store={store}>
            <MemoryRouter initialEntries={[path]}>
                <QueryClientProvider client={queryClient}>
                    <Routes>
                        <Route
                            path="/account/profile/:username"
                            element={<ProfileForViewer />}
                        />
                    </Routes>
                </QueryClientProvider>
            </MemoryRouter>
        </ReduxProvider>,
    );
};

beforeEach(() => {
    vi.clearAllMocks();
});

const baseUserProfile = {
    username: "testUser",
    profilePhoto: "avatar.jpg",
    friendsCount: 2,
    followedCount: 3,
    followersCount: 4,
    photosCount: 15,
    mostPopularPhotos: [
        {
            id: 1,
            src: "photo-1.jpg",
            title: "first photo",
            heartsCount: 10,
            viewsCount: 100,
        },
        {
            id: 2,
            src: "photo-2.jpg",
            title: "second photo",
            heartsCount: 5,
            viewsCount: 50,
        },
    ],
};

describe("UserOwnProfile – integration tests", () => {
    test("renders own profile data and most popular photos using real useQuery", async () => {
        getUserOwnProfile.mockResolvedValueOnce(baseUserProfile);

        renderUserOwnProfile();

        expect(await screen.findByText("testUser")).toBeInTheDocument();

        expect(
            screen.getByRole("heading", { name: /most popular photos/i }),
        ).toBeInTheDocument();

        expect(screen.getByText("Friends")).toBeInTheDocument();
        expect(screen.getByText("Followed")).toBeInTheDocument();
        expect(screen.getByText("Followers")).toBeInTheDocument();
        expect(screen.getByText("Photos")).toBeInTheDocument();

        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
        expect(screen.getByText("4")).toBeInTheDocument();
        expect(screen.getByText("15")).toBeInTheDocument();

        expect(screen.getByAltText("first photo")).toBeInTheDocument();
        expect(screen.getByAltText("second photo")).toBeInTheDocument();

        expect(
            screen.queryByText("You haven't added any photos."),
        ).not.toBeInTheDocument();

        expect(getUserOwnProfile).toHaveBeenCalledTimes(1);
    });

    test("shows empty state text when user has no photos", async () => {
        getUserOwnProfile.mockResolvedValueOnce({
            ...baseUserProfile,
            mostPopularPhotos: [],
        });

        renderUserOwnProfile();

        expect(await screen.findByText("testUser")).toBeInTheDocument();
        expect(
            screen.getByText("You haven't added any photos."),
        ).toBeInTheDocument();
    });

    test("changes profile photo and calls API with selected file", async () => {
        getUserOwnProfile.mockResolvedValueOnce(baseUserProfile);
        const file = new File(["avatar"], "avatar.png", { type: "image/png" });

        const { container } = renderUserOwnProfile();

        await screen.findByText("testUser");

        const changePhotoButton = screen.getByText(/change profile photo\./i);
        await userEvent.click(changePhotoButton);

        const fileInput = container.querySelector('input[type="file"]');

        await act(async () => {
            fireEvent.change(fileInput, {
                target: { files: [file] },
            });
        });

        await waitFor(() => {
            expect(changeUserProfilePhoto).toHaveBeenCalledTimes(1);
        });

        const firstCallArg = changeUserProfilePhoto.mock.calls[0][0];
        expect(firstCallArg).toBe(file);
    });
});

describe("ProfileForViewer – integration tests", () => {
    test("renders viewer profile with follow and add to friends buttons and empty photos text", async () => {
        const viewerProfile = {
            isOwnProfile: false,
            isFollowing: false,
            friendStatus: UserFriendStatus.NONE,
            profile: {
                ...baseUserProfile,
                username: "otherUser",
                mostPopularPhotos: [],
            },
        };

        getProfileForViewer.mockResolvedValueOnce(viewerProfile);

        renderProfileForViewer();

        expect(await screen.findByText("otherUser")).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "follow" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /add to friends/i }),
        ).toBeInTheDocument();

        expect(
            screen.getByText("This user hasn't added any photos."),
        ).toBeInTheDocument();
    });

    test("clicking follow when not following calls editUserFollowed with correct username", async () => {
        const viewerProfile = {
            isOwnProfile: false,
            isFollowing: false,
            friendStatus: UserFriendStatus.NONE,
            profile: {
                ...baseUserProfile,
                username: "otherUser",
            },
        };

        getProfileForViewer.mockResolvedValueOnce(viewerProfile);

        renderProfileForViewer();

        const followButton = await screen.findByRole("button", {
            name: /^follow$/i,
        });

        await userEvent.click(followButton);

        await waitFor(() => {
            expect(editUserFollowed).toHaveBeenCalledTimes(1);
        });

        const payload = editUserFollowed.mock.calls[0][0];
        expect(payload.followedUsername).toBe("otherUser");
    });

    test("clicking add to friends when not friends calls editUserFriends with correct username", async () => {
        const viewerProfile = {
            isOwnProfile: false,
            isFollowing: false,
            friendStatus: UserFriendStatus.NONE,
            profile: {
                ...baseUserProfile,
                username: "otherUser",
            },
        };

        getProfileForViewer.mockResolvedValueOnce(viewerProfile);

        renderProfileForViewer();

        const addFriendButton = await screen.findByRole("button", {
            name: /add to friends/i,
        });

        await userEvent.click(addFriendButton);

        await waitFor(() => {
            expect(editUserFriends).toHaveBeenCalledTimes(1);
        });

        const payload = editUserFriends.mock.calls[0][0];
        expect(payload.friendUsername).toBe("otherUser");
    });

    test("clicking 'click to accept' when friend request is received calls changeUserFriendsStatus", async () => {
        const viewerProfile = {
            isOwnProfile: false,
            isFollowing: false,
            friendStatus: UserFriendStatus.PENDING_RECEIVED,
            profile: {
                ...baseUserProfile,
                username: "otherUser",
            },
        };

        getProfileForViewer.mockResolvedValueOnce(viewerProfile);

        renderProfileForViewer();

        const acceptButton = await screen.findByRole("button", {
            name: /click to accept/i,
        });

        await userEvent.click(acceptButton);

        await waitFor(() => {
            expect(changeUserFriendsStatus).toHaveBeenCalledTimes(1);
        });

        const payload = changeUserFriendsStatus.mock.calls[0][0];
        expect(payload.friendUsername).toBe("otherUser");
        expect(payload.status).toBe(UserFriendStatus.ACCEPTED);
    });

    test("renders viewer profile with unfollow and remove from friends buttons when already related", async () => {
        const viewerProfile = {
            isOwnProfile: false,
            isFollowing: true,
            friendStatus: UserFriendStatus.ACCEPTED,
            profile: {
                ...baseUserProfile,
                username: "otherUser",
            },
        };

        getProfileForViewer.mockResolvedValueOnce(viewerProfile);

        renderProfileForViewer();

        expect(await screen.findByText("otherUser")).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /unfollow/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /remove from friends/i }),
        ).toBeInTheDocument();
    });
});
