Cypress.on("uncaught:exception", (err) => {
    if (
        err.message.includes(
            "Cannot read properties of null (reading 'document')",
        )
    ) {
        return false;
    }
});

describe("Account social page", () => {
    const FRIENDS_URL = "http://localhost:5173/account/friends";

    const visitFriendsAsLoggedIn = () => {
        cy.visit(FRIENDS_URL, {
            onBeforeLoad(win) {
                win.localStorage.setItem("is_logged_in", "true");
                win.localStorage.setItem("username", "magdaCzarnecka");

                win.IntersectionObserver = class {
                    constructor(cb) {
                        this.cb = cb;
                    }

                    observe(element) {
                        this.cb([{ isIntersecting: true, target: element }]);
                    }

                    unobserve() {}

                    disconnect() {}
                };
            },
        });
    };

    beforeEach(() => {
        cy.intercept("GET", "**/account/check", {
            statusCode: 200,
            body: { authenticated: true },
        }).as("accountCheck");
    });

    it("shows empty state when user has no friends", () => {
        cy.intercept("GET", "**/user-dashboard/friends*", {
            statusCode: 200,
            body: {
                items: [],
                hasNext: false,
            },
        }).as("getFriendsEmpty");

        visitFriendsAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getFriendsEmpty");

        cy.contains("social list").should("be.visible");
        cy.contains("You have no friends yet.").should("be.visible");
    });

    it("renders friends, followed and followers lists and switches tabs", () => {
        const friendsResponse = {
            items: [
                {
                    username: "friend-1",
                    profilePhoto: "https://example.com/friend-1.jpg",
                    isUserFriend: true,
                    commonPrivateChatId: null,
                },
                {
                    username: "friend-2",
                    profilePhoto: "https://example.com/friend-2.jpg",
                    isUserFriend: true,
                    commonPrivateChatId: null,
                },
            ],
            hasNext: false,
        };

        const followedResponse = {
            items: [
                {
                    username: "followed-1",
                    profilePhoto: "https://example.com/followed-1.jpg",
                    isUserFriend: false,
                    commonPrivateChatId: null,
                },
            ],
            hasNext: false,
        };

        const followersResponse = {
            items: [
                {
                    username: "follower-1",
                    profilePhoto: "https://example.com/follower-1.jpg",
                    isUserFriend: false,
                    commonPrivateChatId: null,
                },
            ],
            hasNext: false,
        };

        cy.intercept("GET", "**/user-dashboard/friends*", {
            statusCode: 200,
            body: friendsResponse,
        }).as("getFriends");

        cy.intercept("GET", "**/user-dashboard/followed*", {
            statusCode: 200,
            body: followedResponse,
        }).as("getFollowed");

        cy.intercept("GET", "**/user-dashboard/followers*", {
            statusCode: 200,
            body: followersResponse,
        }).as("getFollowers");

        visitFriendsAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getFriends");

        cy.contains("social list").should("be.visible");

        cy.contains("button", "friends").should("be.visible");
        cy.contains("button", "followed").should("be.visible");
        cy.contains("button", "followers").should("be.visible");

        cy.get('[data-testid="social-card"]').should("have.length", 2);
        cy.contains("friend-1").should("be.visible");
        cy.contains("friend-2").should("be.visible");

        cy.contains("button", "followed").click();
        cy.wait("@getFollowed");
        cy.get('[data-testid="social-card"]').should("have.length", 1);
        cy.contains("followed-1").should("be.visible");

        cy.contains("button", "followers").click();
        cy.wait("@getFollowers");
        cy.get('[data-testid="social-card"]').should("have.length", 1);
        cy.contains("follower-1").should("be.visible");
    });

    it("loads next page of friends when scrolling to bottom", () => {
        const firstPageItems = Array.from({ length: 12 }, (_, i) => ({
            username: `friend-${i + 1}`,
            profilePhoto: `https://example.com/friend-${i + 1}.jpg`,
            isUserFriend: true,
            commonPrivateChatId: null,
        }));

        const firstPageResponse = {
            items: firstPageItems,
            hasNext: true,
        };

        const secondPageResponse = {
            items: [
                {
                    username: "friend-100",
                    profilePhoto: "https://example.com/friend-100.jpg",
                    isUserFriend: true,
                    commonPrivateChatId: null,
                },
            ],
            hasNext: false,
        };

        cy.intercept("GET", "**/user-dashboard/friends*", (req) => {
            const url = new URL(req.url);
            const page = url.searchParams.get("page") || "0";

            if (page === "0") {
                req.reply({ statusCode: 200, body: firstPageResponse });
            } else if (page === "1") {
                req.reply({ statusCode: 200, body: secondPageResponse });
            } else {
                req.reply({
                    statusCode: 200,
                    body: { items: [], hasNext: false },
                });
            }
        }).as("getFriendsScroll");

        visitFriendsAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getFriendsScroll");

        cy.get('[data-testid="social-card"]').should("have.length", 12);

        cy.scrollTo("bottom");

        cy.wait("@getFriendsScroll");

        cy.get('[data-testid="social-card"]').should("have.length", 13);
        cy.contains("friend-100").should("be.visible");
    });

    it("shows friend invites and accepts an invite", () => {
        const initialFriendsResponse = {
            items: [],
            hasNext: false,
        };

        const invitesResponse = {
            items: [
                {
                    username: "invite-user-1",
                    profilePhoto: "https://example.com/invite-1.jpg",
                },
                {
                    username: "invite-user-2",
                    profilePhoto: "https://example.com/invite-2.jpg",
                },
            ],
            hasNext: false,
        };

        cy.intercept("GET", "**/user-dashboard/friends*", {
            statusCode: 200,
            body: initialFriendsResponse,
        }).as("getFriendsBase");

        cy.intercept("GET", "**/user-dashboard/friends/invites*", {
            statusCode: 200,
            body: invitesResponse,
        }).as("getInvites");

        cy.intercept("PATCH", "**/user-dashboard/friends/change-status*", {
            statusCode: 200,
            body: {},
        }).as("changeStatus");

        visitFriendsAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getFriendsBase");

        cy.contains("button", "See friend invites").click();

        cy.wait("@getInvites");

        cy.contains("Invites").should("be.visible");
        cy.contains("invite-user-1").should("be.visible");
        cy.contains("invite-user-2").should("be.visible");

        cy.contains("invite-user-1").parents("li").find("button").eq(1).click();

        cy.wait("@changeStatus");
    });
});
