import React from "react";
import { describe, test, beforeEach, vi, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { Provider as ReduxProvider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { accountSlice } from "../../../redux/account.tsx";
import UserOwnSocial from "../../../pages/account/social/UserOwnSocial.tsx";
import SocialForViewer from "../../../pages/account/social/SocialForViewer.tsx";
import FriendInvitesList from "../../../pages/account/social/components/FriendInvitesList.tsx";
import SearchFriendsList from "../../../pages/account/social/components/SearchFriendsList.tsx";
import { SocialListType } from "../../../model/enum/account/social/socialListType";

import {
    getUserOwnFriends,
    getUserOwnFollowed,
    getUserOwnFollowers,
    getUserFriendsForViewer,
    getAllUserPhotos,
    searchUsersByUsername,
    getAllFriendInvites,
    changeUserFriendsStatus,
} from "../../../http/user-dashboard";

vi.mock("../../../http/user-dashboard", () => ({
    getUserOwnFriends: vi.fn(),
    getUserOwnFollowed: vi.fn(),
    getUserOwnFollowers: vi.fn(),
    getUserFriendsForViewer: vi.fn(),
    getUserFollowedForViewer: vi.fn(),
    getUserFollowersForViewer: vi.fn(),
    getAllUserPhotos: vi.fn(),
    searchUsersByUsername: vi.fn(),
    getAllFriendInvites: vi.fn(),
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

const socialReducer = (state = { type: SocialListType.FRIENDS }, action) =>
    state;

const chatsReducer = (state = { entities: {} }, action) => state;

const createTestStore = (socialType = SocialListType.FRIENDS) =>
    configureStore({
        reducer: {
            account: accountSlice.reducer,
            social: socialReducer,
            chats: chatsReducer,
        },
        preloadedState: {
            account: { isLogged: true },
            social: { type: socialType },
            chats: { entities: {} },
        },
    });

const renderUserOwnSocial = (socialType = SocialListType.FRIENDS) => {
    const store = createTestStore(socialType);
    const queryClient = createTestQueryClient();

    return render(
        <ReduxProvider store={store}>
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <UserOwnSocial />
                </QueryClientProvider>
            </MemoryRouter>
        </ReduxProvider>,
    );
};

const renderSocialForViewer = (socialType = SocialListType.FRIENDS) => {
    const store = createTestStore(socialType);
    const queryClient = createTestQueryClient();

    return render(
        <ReduxProvider store={store}>
            <MemoryRouter initialEntries={["/account/social/otherUser"]}>
                <QueryClientProvider client={queryClient}>
                    <Routes>
                        <Route
                            path="/account/social/:username"
                            element={<SocialForViewer />}
                        />
                    </Routes>
                </QueryClientProvider>
            </MemoryRouter>
        </ReduxProvider>,
    );
};

const renderFriendInvitesList = (onClose = vi.fn()) => {
    const store = createTestStore();
    const queryClient = createTestQueryClient();

    render(
        <ReduxProvider store={store}>
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <FriendInvitesList onClose={onClose} />
                </QueryClientProvider>
            </MemoryRouter>
        </ReduxProvider>,
    );

    return { onClose };
};

const renderSearchFriendsList = () => {
    const store = createTestStore(SocialListType.FRIENDS);
    const queryClient = createTestQueryClient();

    return render(
        <ReduxProvider store={store}>
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <SearchFriendsList onClose={() => {}} />
                </QueryClientProvider>
            </MemoryRouter>
        </ReduxProvider>,
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

const ownFriendsFirstPage = {
    hasNext: false,
    items: [
        {
            username: "friend1",
            profilePhoto: "friend1.jpg",
            isUserFriend: true,
        },
        {
            username: "friend2",
            profilePhoto: "friend2.jpg",
            isUserFriend: true,
        },
    ],
};

const ownFriendsFirstPageHasNext = {
    hasNext: true,
    items: [
        {
            username: "friend1",
            profilePhoto: "friend1.jpg",
            isUserFriend: true,
        },
    ],
};

const ownFriendsSecondPage = {
    hasNext: false,
    items: [
        {
            username: "friend2",
            profilePhoto: "friend2.jpg",
            isUserFriend: true,
        },
    ],
};

describe("UserOwnSocial – integration tests", () => {
    test("renders own friends list from API (first page)", async () => {
        getUserOwnFriends.mockResolvedValueOnce(ownFriendsFirstPage);

        renderUserOwnSocial(SocialListType.FRIENDS);

        expect(await screen.findByText(/social list/i)).toBeInTheDocument();

        expect(screen.getByText("friend1")).toBeInTheDocument();
        expect(screen.getByText("friend2")).toBeInTheDocument();

        expect(
            screen.queryByText("You have no friends yet."),
        ).not.toBeInTheDocument();

        expect(getUserOwnFriends).toHaveBeenCalledTimes(1);
        const args = getUserOwnFriends.mock.calls[0];
        expect(args[0]).toBe(0);
        expect(args[1]).toBe(12);
    });

    test("shows empty friends state when API returns empty list", async () => {
        getUserOwnFriends.mockResolvedValueOnce({
            hasNext: false,
            items: [],
        });

        renderUserOwnSocial(SocialListType.FRIENDS);

        expect(
            await screen.findByText("You have no friends yet."),
        ).toBeInTheDocument();
    });

    test("loads next friends page after sentinel intersection (infinite scroll)", async () => {
        getUserOwnFriends
            .mockResolvedValueOnce(ownFriendsFirstPageHasNext)
            .mockResolvedValueOnce(ownFriendsSecondPage);

        renderUserOwnSocial(SocialListType.FRIENDS);

        expect(await screen.findByText("friend1")).toBeInTheDocument();

        await waitFor(() => {
            expect(intersectionCallback).toBeTruthy();
        });

        await waitFor(() => {
            intersectionCallback([{ isIntersecting: true }]);
        });

        expect(await screen.findByText("friend2")).toBeInTheDocument();

        expect(getUserOwnFriends).toHaveBeenCalledTimes(2);
        const second = getUserOwnFriends.mock.calls[1];
        expect(second[0]).toBe(1);
        expect(second[1]).toBe(12);
    });

    test("shows followed empty state", async () => {
        getUserOwnFollowed.mockResolvedValueOnce({
            hasNext: false,
            items: [],
        });

        renderUserOwnSocial(SocialListType.FOLLOWED);

        expect(
            await screen.findByText("You're not following anyone yet."),
        ).toBeInTheDocument();
    });

    test("shows followers empty state", async () => {
        getUserOwnFollowers.mockResolvedValueOnce({
            hasNext: false,
            items: [],
        });

        renderUserOwnSocial(SocialListType.FOLLOWERS);

        expect(
            await screen.findByText("You have no followers yet."),
        ).toBeInTheDocument();
    });

    test("opens Add new friend modal and shows search header", async () => {
        getUserOwnFriends.mockResolvedValueOnce(ownFriendsFirstPage);
        searchUsersByUsername.mockResolvedValueOnce({
            hasNext: false,
            items: [],
        });

        const modalRoot = document.createElement("div");
        modalRoot.id = "modal";
        document.body.appendChild(modalRoot);

        renderUserOwnSocial(SocialListType.FRIENDS);

        expect(await screen.findByText(/social list/i)).toBeInTheDocument();

        const addNewFriendButton = screen.getByText(/add new friend/i);
        await userEvent.click(addNewFriendButton);

        expect(
            await screen.findByText("Search new Friend"),
        ).toBeInTheDocument();
    });

    test("opens friend invites modal and shows invites", async () => {
        getUserOwnFriends.mockResolvedValueOnce(ownFriendsFirstPage);
        getAllFriendInvites.mockResolvedValueOnce({
            hasNext: false,
            items: [{ username: "inviteUser", profilePhoto: "invite.jpg" }],
        });

        const modalRoot = document.createElement("div");
        modalRoot.id = "modal";
        document.body.appendChild(modalRoot);

        renderUserOwnSocial(SocialListType.FRIENDS);

        expect(await screen.findByText(/social list/i)).toBeInTheDocument();

        const invitesButton = screen.getByText(/see friend invites/i);
        await userEvent.click(invitesButton);

        expect(await screen.findByText("Invites")).toBeInTheDocument();
        expect(await screen.findByText(/inviteUser/i)).toBeInTheDocument();
    });
});

describe("SocialForViewer – integration tests", () => {
    test("renders viewer friends list", async () => {
        getUserFriendsForViewer.mockResolvedValueOnce({
            hasNext: false,
            items: [
                {
                    username: "viewerFriend1",
                    profilePhoto: "vf1.jpg",
                    isUserFriend: true,
                },
            ],
        });

        renderSocialForViewer(SocialListType.FRIENDS);

        expect(await screen.findByText("viewerFriend1")).toBeInTheDocument();

        expect(
            screen.queryByText("This user has no friends yet."),
        ).not.toBeInTheDocument();

        expect(getUserFriendsForViewer).toHaveBeenCalledTimes(1);
        const args = getUserFriendsForViewer.mock.calls[0];
        expect(args[0]).toBe("otherUser");
        expect(args[1]).toBe(0);
        expect(args[2]).toBe(12);
    });

    test("shows viewer friends empty state", async () => {
        getUserFriendsForViewer.mockResolvedValueOnce({
            hasNext: false,
            items: [],
        });

        renderSocialForViewer(SocialListType.FRIENDS);

        expect(
            await screen.findByText("This user has no friends yet."),
        ).toBeInTheDocument();
    });

    test("renders viewer photos list", async () => {
        getAllUserPhotos.mockResolvedValueOnce({
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
            ],
        });

        renderSocialForViewer(SocialListType.PHOTOS);

        const photos = await screen.findAllByTestId("user-photo");
        expect(photos).toHaveLength(2);

        expect(
            screen.queryByText("This user hasn't added any photos."),
        ).not.toBeInTheDocument();

        expect(getAllUserPhotos).toHaveBeenCalledTimes(1);
        const args = getAllUserPhotos.mock.calls[0];
        expect(args[0]).toBe("otherUser");
        expect(args[1]).toBe(0);
        expect(args[2]).toBe(2);
    });

    test("shows viewer photos empty state", async () => {
        getAllUserPhotos.mockResolvedValueOnce({
            hasNext: false,
            items: [],
        });

        renderSocialForViewer(SocialListType.PHOTOS);

        expect(
            await screen.findByText("This user hasn't added any photos."),
        ).toBeInTheDocument();
    });
});

describe("FriendInvitesList – integration tests", () => {
    test("shows empty invites state", async () => {
        getAllFriendInvites.mockResolvedValueOnce({
            hasNext: false,
            items: [],
        });

        const modalRoot = document.createElement("div");
        modalRoot.id = "modal";
        document.body.appendChild(modalRoot);

        renderFriendInvitesList();

        expect(await screen.findByText("Invites")).toBeInTheDocument();

        expect(
            await screen.findByText("You don't have any invites yet"),
        ).toBeInTheDocument();
    });

    test("calls accept and reject handlers (closes modal)", async () => {
        getAllFriendInvites.mockResolvedValueOnce({
            hasNext: false,
            items: [
                {
                    username: "inviter",
                    profilePhoto: "inviter.jpg",
                },
            ],
        });

        changeUserFriendsStatus.mockResolvedValue({});

        const modalRoot = document.createElement("div");
        modalRoot.id = "modal";
        document.body.appendChild(modalRoot);

        const onClose = vi.fn();
        renderFriendInvitesList(onClose);

        expect(await screen.findByText("inviter")).toBeInTheDocument();

        const buttons = screen.getAllByRole("button");
        const acceptButton = buttons[2];
        const rejectButton = buttons[3];

        await userEvent.click(acceptButton);
        await userEvent.click(rejectButton);

        await waitFor(() => {
            expect(changeUserFriendsStatus).toHaveBeenCalledTimes(2);
            expect(onClose).toHaveBeenCalledTimes(2);
        });
    });
});

describe("SearchFriendsList – integration tests", () => {
    test("shows empty search message when no results", async () => {
        searchUsersByUsername.mockResolvedValueOnce({
            hasNext: false,
            items: [],
        });

        renderSearchFriendsList();

        expect(
            await screen.findByText("Search new Friend"),
        ).toBeInTheDocument();

        expect(
            await screen.findByText("We can't find a user with this username."),
        ).toBeInTheDocument();
    });

    test("renders searched user in results", async () => {
        searchUsersByUsername.mockResolvedValue({
            hasNext: false,
            items: [
                {
                    username: "newFriend",
                    profilePhoto: "nf.jpg",
                    isUserFriend: false,
                },
            ],
        });

        renderSearchFriendsList();

        const input = screen.getByPlaceholderText("Search friends");
        await userEvent.type(input, "new");

        expect(await screen.findByText("newFriend")).toBeInTheDocument();
    });
});
