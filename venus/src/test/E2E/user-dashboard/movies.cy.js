Cypress.on("uncaught:exception", (err) => {
    if (
        err.message.includes(
            "Cannot read properties of null (reading 'document')",
        )
    ) {
        return false;
    }
});

describe("Account movies page", () => {
    const MOVIES_URL = "http://localhost:5173/account/movies";

    const visitMoviesAsLoggedIn = () => {
        cy.visit(MOVIES_URL, {
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

    it("shows empty state when there are no movies", () => {
        cy.intercept("GET", "**/user-dashboard/movies*", {
            statusCode: 200,
            body: {
                items: [],
                hasNext: false,
            },
        }).as("getMoviesEmpty");

        visitMoviesAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getMoviesEmpty");

        cy.contains("Movies").should("be.visible");
        cy.get('[data-testid="user-movie"]').should("not.exist");
    });

    it("renders movies list and allows changing sort order", () => {
        const descendingResponse = {
            items: [
                {
                    date: "2025-01-02",
                    media: [
                        {
                            id: 1,
                            src: "https://example.com/video-1.mp4",
                            heartsCount: 10,
                            viewsCount: 100,
                            addDate: "2025-01-02T10:00:00",
                        },
                    ],
                },
                {
                    date: "2025-01-01",
                    media: [
                        {
                            id: 2,
                            src: "https://example.com/video-2.mp4",
                            heartsCount: 5,
                            viewsCount: 50,
                            addDate: "2025-01-01T09:00:00",
                        },
                    ],
                },
            ],
            hasNext: false,
        };

        const ascendingResponse = {
            items: [
                {
                    date: "2025-01-01",
                    media: [
                        {
                            id: 2,
                            src: "https://example.com/video-2.mp4",
                            heartsCount: 5,
                            viewsCount: 50,
                            addDate: "2025-01-01T09:00:00",
                        },
                    ],
                },
                {
                    date: "2025-01-02",
                    media: [
                        {
                            id: 1,
                            src: "https://example.com/video-1.mp4",
                            heartsCount: 10,
                            viewsCount: 100,
                            addDate: "2025-01-02T10:00:00",
                        },
                    ],
                },
            ],
            hasNext: false,
        };

        cy.intercept("GET", "**/user-dashboard/movies*", (req) => {
            const url = new URL(req.url);
            const type = url.searchParams.get("type");

            if (type === "DATE_DESCENDING") {
                req.reply({ statusCode: 200, body: descendingResponse });
            } else if (type === "DATE_ASCENDING") {
                req.reply({ statusCode: 200, body: ascendingResponse });
            } else {
                req.reply({ statusCode: 200, body: descendingResponse });
            }
        }).as("getMovies");

        visitMoviesAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getMovies");

        cy.contains("Movies").should("be.visible");
        cy.contains("Sort:").should("be.visible");
        cy.contains("From:").should("be.visible");
        cy.contains("To:").should("be.visible");

        cy.get('[data-testid="user-movie-li"]').should("have.length", 2);

        cy.contains("button", "Date descending").click();
        cy.contains("button", "Date ascending").click();

        cy.wait("@getMovies");

        cy.get('[data-testid="user-movie-li"]').should("have.length", 2);
        cy.contains("button", "Date ascending").should("be.visible");
    });

    it("loads next page when scrolling to bottom", () => {
        const firstPageMedia = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            src: `https://example.com/video-${i + 1}.mp4`,
            heartsCount: 10 + i,
            viewsCount: 100 + i * 10,
            addDate: `2025-01-01T10:${String(i).padStart(2, "0")}:00`,
        }));

        const firstPageResponse = {
            items: [
                {
                    date: "2025-01-01",
                    media: firstPageMedia,
                },
            ],
            hasNext: true,
        };

        const secondPageResponse = {
            items: [
                {
                    date: "2025-01-02",
                    media: [
                        {
                            id: 100,
                            src: "https://example.com/video-100.mp4",
                            heartsCount: 5,
                            viewsCount: 50,
                            addDate: "2025-01-02T11:00:00",
                        },
                    ],
                },
            ],
            hasNext: false,
        };

        cy.intercept("GET", "**/user-dashboard/movies*", (req) => {
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
        }).as("getMoviesScroll");

        visitMoviesAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getMoviesScroll");

        cy.get('[data-testid="user-movie-li"]').should("have.length", 15);

        cy.scrollTo("bottom");

        cy.wait("@getMoviesScroll");

        cy.get('[data-testid="user-movie-li"]').should("have.length", 16);
    });

    it("loads movies page with real backend after real login", () => {
        cy.visit("http://localhost:5173/");

        cy.get("#sidebar-link-login").click();
        cy.url().should("include", "/login");

        cy.get("#username").type("magdaCzarnecka");
        cy.get("#password").type("Password1!");
        cy.get('button[type="submit"]').click();

        cy.url().should("eq", "http://localhost:5173/");

        cy.window().should((win) => {
            expect(win.localStorage.getItem("is_logged_in")).to.eq("true");
            expect(win.localStorage.getItem("username")).to.eq("magdaCzarnecka");
        });

        cy.intercept("GET", "**/user-dashboard/movies*").as("getMoviesReal");

        cy.visit(MOVIES_URL);

        cy.wait("@accountCheck");
        cy.wait("@getMoviesReal").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body).to.have.property("items");
            expect(interception.response?.body).to.have.property("hasNext");
        });

        cy.contains("Movies").should("be.visible");

        cy.get("body").then(($body) => {
            if ($body.find('[data-testid="user-movie-li"]').length) {
                cy.get('[data-testid="user-movie-li"]')
                    .its("length")
                    .should("be.greaterThan", 0);
            }
        });
    });
});
