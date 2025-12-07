Cypress.on("uncaught:exception", (err) => {
    if (
        err.message.includes(
            "Cannot read properties of null (reading 'document')",
        )
    ) {
        return false;
    }
});

describe("Account favorite spots page", () => {
    const FAVORITE_SPOTS_URL = "http://localhost:5173/account/favorite-spots";

    const visitFavoriteSpotsAsLoggedIn = () => {
        cy.visit(FAVORITE_SPOTS_URL, {
            onBeforeLoad(win) {
                win.localStorage.setItem("is_logged_in", "true");
                win.localStorage.setItem("username", "user");
            },
        });
    };

    beforeEach(() => {
        cy.intercept("GET", "**/account/check", {
            statusCode: 200,
            body: { authenticated: true },
        }).as("accountCheck");

        cy.intercept("GET", "**/public/spot/most-popular", {
            statusCode: 200,
            body: [],
        }).as("mostPopular");
    });

    it("shows empty state when there are no favorite spots", () => {
        cy.intercept("GET", "**/user-dashboard/favorite-spots*", {
            statusCode: 200,
            body: {
                items: [],
                hasNext: false,
            },
        }).as("getFavoriteSpotsEmpty");

        visitFavoriteSpotsAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getFavoriteSpotsEmpty");

        cy.contains("spots lists").should("be.visible");
        cy.contains("You don't have any spots in your list.").should(
            "be.visible",
        );
    });

    it("renders favorite spots list and allows changing list type", () => {
        const allResponse = {
            items: [
                {
                    id: 1,
                    type: "ALL",
                    coords: { lat: 10, lon: 20 },
                    imageUrl: "https://example.com/image-1.jpg",
                    viewsCount: 100,
                    city: "City A",
                    country: "Country A",
                    rating: 4.5,
                    name: "All Spot 1",
                    tags: [
                        { id: 1, name: "tag-1" },
                        { id: 2, name: "tag-2" },
                    ],
                    description: "Spot in All list",
                },
            ],
            hasNext: false,
        };

        const favoritesResponse = {
            items: [
                {
                    id: 2,
                    type: "FAVORITE",
                    coords: { lat: 30, lon: 40 },
                    imageUrl: "https://example.com/image-2.jpg",
                    viewsCount: 200,
                    city: "City B",
                    country: "Country B",
                    rating: 5,
                    name: "Favorite Spot 1",
                    tags: [{ id: 3, name: "fav-tag" }],
                    description: "Spot in Favorites list",
                },
            ],
            hasNext: false,
        };

        cy.intercept("GET", "**/user-dashboard/favorite-spots*", (req) => {
            const url = new URL(req.url);
            const type = url.searchParams.get("type");

            if (type === "ALL") {
                req.reply({ statusCode: 200, body: allResponse });
            } else if (type === "FAVORITE") {
                req.reply({ statusCode: 200, body: favoritesResponse });
            } else {
                req.reply({ statusCode: 200, body: allResponse });
            }
        }).as("getFavoriteSpots");

        visitFavoriteSpotsAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getFavoriteSpots");

        cy.contains("spots lists").should("be.visible");
        cy.contains("All").should("be.visible");
        cy.contains("Favorites").should("be.visible");
        cy.contains("Plan to visit").should("be.visible");

        cy.get('[data-testid^="spot-rating-"]').should("have.length", 1);
        cy.contains("All Spot 1").should("be.visible");

        cy.contains("button", "Favorites").click();

        cy.wait("@getFavoriteSpots");

        cy.get('[data-testid^="spot-rating-"]').should("have.length", 1);
        cy.contains("Favorite Spot 1").should("be.visible");
    });

    it("loads next page when scrolling to bottom", () => {
        const firstPageItems = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            type: "FAVORITE",
            coords: { lat: 10 + i, lon: 20 + i },
            imageUrl: `https://example.com/image-${i + 1}.jpg`,
            viewsCount: 100 + i,
            city: `City ${i + 1}`,
            country: "Country",
            rating: 4,
            name: `Spot ${i + 1}`,
            tags: [{ id: 1, name: "tag" }],
            description: `Description ${i + 1}`,
        }));

        const firstPageResponse = {
            items: firstPageItems,
            hasNext: true,
        };

        const secondPageResponse = {
            items: [
                {
                    id: 100,
                    type: "FAVORITE",
                    coords: { lat: 50, lon: 60 },
                    imageUrl: "https://example.com/image-100.jpg",
                    viewsCount: 999,
                    city: "City 100",
                    country: "Country",
                    rating: 5,
                    name: "Spot 100",
                    tags: [{ id: 2, name: "tag-100" }],
                    description: "Description 100",
                },
            ],
            hasNext: false,
        };

        cy.intercept("GET", "**/user-dashboard/favorite-spots*", (req) => {
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
        }).as("getFavoriteSpotsScroll");

        visitFavoriteSpotsAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getFavoriteSpotsScroll");

        cy.get('[data-testid^="spot-rating-"]').should("have.length", 15);

        cy.scrollTo("bottom");

        cy.wait("@getFavoriteSpotsScroll");

        cy.get('[data-testid^="spot-rating-"]').should("have.length", 16);
    });
});
