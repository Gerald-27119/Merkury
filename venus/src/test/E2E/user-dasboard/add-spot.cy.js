Cypress.on("uncaught:exception", (err) => {
    if (
        err.message.includes(
            "Cannot read properties of null (reading 'document')",
        )
    ) {
        return false;
    }
});

describe("Account added spots page", () => {
    const ADDED_SPOT_URL = "http://localhost:5173/account/add-spot";

    const visitAddedSpotsAsLoggedIn = (width = 1200, height = 800) => {
        cy.viewport(width, height);

        cy.visit(ADDED_SPOT_URL, {
            onBeforeLoad(win) {
                win.localStorage.setItem("is_logged_in", "true");
                win.localStorage.setItem("username", "user");

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

    it("shows empty state when user has not added any spots", () => {
        cy.intercept("GET", "**/user-dashboard/add-spot*", {
            statusCode: 200,
            body: {
                items: [],
                hasNext: false,
            },
        }).as("getAddedSpotsEmpty");

        visitAddedSpotsAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getAddedSpotsEmpty");

        cy.contains("Add spot").should("be.visible");
        cy.contains("You haven't added any spots yet.").should("be.visible");
    });

    it("renders added spots list and loads next page on scroll (mocked)", () => {
        const firstPageResponse = {
            items: Array.from({ length: 4 }, (_, i) => ({
                id: i + 1,
                name: `My Spot ${i + 1}`,
                description: `Description ${i + 1}`,
                country: "Poland",
                region: "Pomorskie",
                city: "Gdańsk",
                street: `Street ${i + 1}`,
                firstPhotoUrl: `https://example.com/spot-${i + 1}.jpg`,
                borderPoints: [{ x: 54.35 + i * 0.001, y: 18.64 + i * 0.001 }],
            })),
            hasNext: true,
        };

        const secondPageResponse = {
            items: [
                {
                    id: 100,
                    name: "My Spot 100",
                    description: "Second page spot",
                    country: "Poland",
                    region: "Pomorskie",
                    city: "Gdańsk",
                    street: "Second street",
                    firstPhotoUrl: "https://example.com/spot-100.jpg",
                    borderPoints: [{ x: 54.36, y: 18.65 }],
                },
            ],
            hasNext: false,
        };

        cy.intercept("GET", "**/user-dashboard/add-spot*", (req) => {
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
        }).as("getAddedSpotsScroll");

        visitAddedSpotsAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getAddedSpotsScroll");

        cy.get('img[alt="spot-image"]').should("have.length", 4);
        cy.contains("My Spot 1").should("be.visible");

        cy.wait("@getAddedSpotsScroll");

        cy.get('img[alt="spot-image"]').should("have.length", 5);
        cy.contains("My Spot 100").should("be.visible");
    });

    it("opens Add spot modal on desktop", () => {
        cy.intercept("GET", "**/user-dashboard/add-spot*", {
            statusCode: 200,
            body: {
                items: [],
                hasNext: false,
            },
        }).as("getAddedSpots");

        visitAddedSpotsAsLoggedIn(1200, 800);

        cy.wait("@accountCheck");
        cy.wait("@getAddedSpots");

        cy.contains("button", "Add spot").click();

        cy.contains("Add spot").should("be.visible");
        cy.contains("Basic Information").should("be.visible");
        cy.contains("Upload Media").should("be.visible");
    });

    it("prevents opening Add spot modal on mobile and shows info notification", () => {
        cy.intercept("GET", "**/user-dashboard/add-spot*", {
            statusCode: 200,
            body: {
                items: [],
                hasNext: false,
            },
        }).as("getAddedSpotsMobile");

        visitAddedSpotsAsLoggedIn(800, 600);

        cy.wait("@accountCheck");
        cy.wait("@getAddedSpotsMobile");

        cy.contains("button", "Add spot").click();

        cy.contains("To add a spot, please use a bigger screen.").should(
            "be.visible",
        );
        cy.contains("Basic Information").should("not.exist");
    });

    it("allows adding a new spot via modal (real backend)", () => {
        cy.viewport(1920, 1080);

        cy.visit("http://localhost:5173/");

        cy.get("#sidebar-link-login").click();
        cy.url().should("include", "/login");

        cy.get("#username").type("user");
        cy.get("#password").type("password");
        cy.get('button[type="submit"]').click();

        cy.url().should("not.include", "/login");

        cy.intercept("GET", "**/user-dashboard/add-spot*").as(
            "getAddedSpotsReal",
        );
        cy.intercept("POST", "**/user-dashboard/add-spot*").as("addSpotReal");

        cy.visit(ADDED_SPOT_URL);

        cy.wait("@accountCheck");
        cy.wait("@getAddedSpotsReal");

        cy.contains("button", "Add spot").click();

        cy.contains("Add spot").should("be.visible");
        cy.contains("Basic Information").should("be.visible");

        cy.get("#name").type("Test Spot");
        cy.get("#description").type("Beautiful place near the city center");
        cy.get("#country").type("Poland");
        cy.get("#region").type("Pomorskie");
        cy.get("#city").type("Gdańsk");
        cy.get("#street").type("Targ Drzewny 9");

        cy.contains("button", "Upload Media")
            .parent()
            .find('input[type="file"]')
            .selectFile("public/spot.png", { force: true });

        cy.get("canvas").first().click(50, 50).click(100, 80).click(80, 120);

        cy.contains("button", "Finish Polygon").click();

        cy.contains("button", "add spot", { matchCase: false }).click();

        cy.wait("@addSpotReal");
        cy.wait("@getAddedSpotsReal");

        cy.contains("Successfully added spot.").should("be.visible");
        cy.contains("Test Spot").should("be.visible");
        cy.contains("Poland, Gdańsk, Targ Drzewny 9").should("be.visible");
        cy.get('img[alt="spot-image"]').should("exist");
    });
});
