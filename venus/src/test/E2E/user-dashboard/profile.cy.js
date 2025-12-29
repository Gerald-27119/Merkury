Cypress.on("uncaught:exception", (err) => {
    if (
        err.message.includes(
            "Cannot read properties of null (reading 'document')",
        )
    ) {
        return false;
    }
});

describe("Account profile page", () => {
    const OWN_PROFILE_URL = "http://localhost:5173/account/profile";
    const VIEWER_PROFILE_URL =
        "http://localhost:5173/account/profile/other-user";

    const visitOwnProfileAsLoggedIn = () => {
        cy.visit(OWN_PROFILE_URL, {
            onBeforeLoad(win) {
                win.localStorage.setItem("is_logged_in", "true");
                win.localStorage.setItem("username", "magdaCzarnecka");
            },
        });
    };

    const visitViewerProfileAsLoggedIn = () => {
        cy.visit(VIEWER_PROFILE_URL, {
            onBeforeLoad(win) {
                win.localStorage.setItem("is_logged_in", "true");
                win.localStorage.setItem("username", "magdaCzarnecka");
            },
        });
    };

    beforeEach(() => {
        cy.intercept("GET", "**/account/check", {
            statusCode: 200,
            body: { authenticated: true },
        }).as("accountCheck");
    });

    it("shows own profile with stats and most popular photos (mocked)", () => {
        cy.intercept("GET", "**/user-dashboard/profile*", {
            statusCode: 200,
            body: {
                username: "user",
                profilePhoto: "https://example.com/profile.jpg",
                friendsCount: 2,
                followedCount: 3,
                followersCount: 4,
                photosCount: 5,
                mostPopularPhotos: [
                    {
                        id: 1,
                        src: "https://example.com/photo-1.jpg",
                        title: "Photo 1",
                        heartsCount: 10,
                        viewsCount: 100,
                    },
                    {
                        id: 2,
                        src: "https://example.com/photo-2.jpg",
                        title: "Photo 2",
                        heartsCount: 5,
                        viewsCount: 50,
                    },
                ],
            },
        }).as("getOwnProfileMock");

        visitOwnProfileAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getOwnProfileMock");

        cy.get('img[alt="profileImage"]').should("be.visible");

        cy.contains("Friends").should("be.visible");
        cy.contains("Followed").should("be.visible");
        cy.contains("Followers").should("be.visible");
        cy.contains("Photos").should("be.visible");

        cy.get('img[alt="Photo 1"]').should("be.visible");
        cy.get('img[alt="Photo 2"]').should("be.visible");
    });

    it("shows message when own profile has no photos", () => {
        cy.intercept("GET", "**/user-dashboard/profile*", {
            statusCode: 200,
            body: {
                username: "user",
                profilePhoto: "https://example.com/profile.jpg",
                friendsCount: 0,
                followedCount: 0,
                followersCount: 0,
                photosCount: 0,
                mostPopularPhotos: [],
            },
        }).as("getOwnProfileEmptyPhotos");

        visitOwnProfileAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getOwnProfileEmptyPhotos");

        cy.contains("most popular photos").should("be.visible");
        cy.contains("You haven't added any photos.").should("be.visible");
    });

    it("navigates to friends list when clicking Friends stat (mocked)", () => {
        cy.intercept("GET", "**/user-dashboard/profile*", {
            statusCode: 200,
            body: {
                username: "user",
                profilePhoto: "https://example.com/profile.jpg",
                friendsCount: 5,
                followedCount: 1,
                followersCount: 2,
                photosCount: 3,
                mostPopularPhotos: [],
            },
        }).as("getOwnProfileForNav");

        cy.intercept("GET", "**/user-dashboard/friends*", {
            statusCode: 200,
            body: {
                items: [],
                hasNext: false,
            },
        }).as("getFriendsList");

        visitOwnProfileAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getOwnProfileForNav");

        cy.contains("button", "Friends").click();

        cy.url().should("include", "/account/friends");
        cy.wait("@getFriendsList");
    });

    it("navigates to photos page when clicking Photos stat (mocked)", () => {
        cy.intercept("GET", "**/user-dashboard/profile*", {
            statusCode: 200,
            body: {
                username: "user",
                profilePhoto: "https://example.com/profile.jpg",
                friendsCount: 5,
                followedCount: 1,
                followersCount: 2,
                photosCount: 3,
                mostPopularPhotos: [],
            },
        }).as("getOwnProfileForPhotos");

        cy.intercept("GET", "**/user-dashboard/photos*", {
            statusCode: 200,
            body: {
                items: [],
                hasNext: false,
            },
        }).as("getPhotosList");

        visitOwnProfileAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getOwnProfileForPhotos");

        cy.contains("button", "Photos").click();

        cy.url().should("include", "/account/photos");
        cy.wait("@getPhotosList");
    });

    it("shows viewer profile with follow and friend actions (mocked)", () => {
        cy.intercept("GET", "**/public/user-dashboard/profile/*", {
            statusCode: 200,
            body: {
                profile: {
                    username: "other-user",
                    profilePhoto: "https://example.com/other-profile.jpg",
                    friendsCount: 1,
                    followedCount: 2,
                    followersCount: 3,
                    photosCount: 4,
                    mostPopularPhotos: [
                        {
                            id: 1,
                            src: "https://example.com/other-photo-1.jpg",
                            title: "Other Photo 1",
                            heartsCount: 7,
                            viewsCount: 77,
                        },
                    ],
                },
                isOwnProfile: false,
                isFollowing: false,
                friendStatus: "NONE",
            },
        }).as("getViewerProfile");

        visitViewerProfileAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getViewerProfile");

        cy.contains("other-user").should("be.visible");
        cy.contains("button", "follow").should("be.visible");
        cy.contains("button", "add to friends").should("be.visible");
        cy.get('img[alt="Other Photo 1"]').should("be.visible");
    });

    it("sends follow and add-friend requests for viewer profile (mocked)", () => {
        cy.intercept("GET", "**/public/user-dashboard/profile/*", {
            statusCode: 200,
            body: {
                profile: {
                    username: "other-user",
                    profilePhoto: "https://example.com/other-profile.jpg",
                    friendsCount: 0,
                    followedCount: 0,
                    followersCount: 0,
                    photosCount: 0,
                    mostPopularPhotos: [],
                },
                isOwnProfile: false,
                isFollowing: false,
                friendStatus: "NONE",
            },
        }).as("getViewerProfileActions");

        cy.intercept("PATCH", "**/user-dashboard/followed*", (req) => {
            const url = new URL(req.url);
            const followed = url.searchParams.get("followedUsername");
            const type = url.searchParams.get("type");

            expect(followed).to.eq("other-user");
            expect(type).to.eq("ADD");

            req.reply({ statusCode: 200 });
        }).as("followUser");

        cy.intercept("PATCH", "**/user-dashboard/friends*", (req) => {
            const url = new URL(req.url);
            const friendUsername = url.searchParams.get("friendUsername");
            const type = url.searchParams.get("type");

            expect(friendUsername).to.eq("other-user");
            expect(type).to.eq("ADD");

            req.reply({ statusCode: 200 });
        }).as("addFriend");

        visitViewerProfileAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getViewerProfileActions");

        cy.contains("button", "follow").click();
        cy.wait("@followUser");

        cy.contains("button", "add to friends").click();
        cy.wait("@addFriend");
    });

    it("loads own profile with real backend after real login", () => {
        cy.visit("http://localhost:5173/");

        cy.get("#sidebar-link-login").click();
        cy.url().should("include", "/login");

        cy.get("#username").type("magdaCzarnecka");
        cy.get("#password").type("Password1!");
        cy.get('button[type="submit"]').click();

        cy.url().should("not.include", "/login");

        cy.intercept("GET", "**/user-dashboard/profile*").as(
            "getOwnProfileReal",
        );

        cy.visit(OWN_PROFILE_URL);

        cy.wait("@getOwnProfileReal");

        cy.contains("Friends").should("be.visible");
        cy.contains("Followed").should("be.visible");
        cy.contains("Followers").should("be.visible");
        cy.contains("Photos").should("be.visible");

        cy.get('img[alt="profileImage"]').should("be.visible");
    });
});
