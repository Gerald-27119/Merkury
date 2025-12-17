Cypress.on("uncaught:exception", (err) => {
    if (
        err.message.includes(
            "Cannot read properties of null (reading 'document')",
        )
    ) {
        return false;
    }
});

describe("Account comments page", () => {
    const COMMENTS_URL = "http://localhost:5173/account/comments";

    beforeEach(() => {
        cy.intercept("GET", "**/account/check", {
            statusCode: 200,
            body: { authenticated: true },
        }).as("accountCheck");
    });

    it("shows empty state message when there are no comments", () => {
        cy.intercept("GET", "**/user-dashboard/comments*", {
            statusCode: 200,
            body: {
                items: [],
                hasNext: false,
            },
        }).as("getCommentsEmpty");

        cy.visit(COMMENTS_URL, {
            onBeforeLoad(win) {
                win.localStorage.setItem("is_logged_in", "true");
                win.localStorage.setItem("username", "magdaCzarnecka");
            },
        });

        cy.wait("@accountCheck");
        cy.wait("@getCommentsEmpty");

        cy.contains("Comments").should("be.visible");
        cy.contains("You haven't added any comments.").should("be.visible");
        cy.get('[data-testid="comment"]').should("not.exist");
    });

    it("renders comments list and allows changing sort order", () => {
        const descendingResponse = {
            items: [
                {
                    spotName: "Zebra Spot",
                    date: "2025-01-02",
                    comments: [
                        {
                            id: 1,
                            addTime: "2025-01-02 10:00",
                            text: "Newest comment",
                        },
                    ],
                },
                {
                    spotName: "Alpha Spot",
                    date: "2025-01-01",
                    comments: [
                        {
                            id: 2,
                            addTime: "2025-01-01 09:00",
                            text: "Oldest comment",
                        },
                    ],
                },
            ],
            hasNext: false,
        };

        const ascendingResponse = {
            items: [
                {
                    spotName: "Alpha Spot",
                    date: "2025-01-01",
                    comments: [
                        {
                            id: 2,
                            addTime: "2025-01-01 09:00",
                            text: "Oldest comment",
                        },
                    ],
                },
                {
                    spotName: "Zebra Spot",
                    date: "2025-01-02",
                    comments: [
                        {
                            id: 1,
                            addTime: "2025-01-02 10:00",
                            text: "Newest comment",
                        },
                    ],
                },
            ],
            hasNext: false,
        };

        cy.intercept("GET", "**/user-dashboard/comments*", (req) => {
            const url = new URL(req.url);
            const type = url.searchParams.get("type");

            if (type === "DATE_DESCENDING") {
                req.reply({ statusCode: 200, body: descendingResponse });
            } else if (type === "DATE_ASCENDING") {
                req.reply({ statusCode: 200, body: ascendingResponse });
            } else {
                req.reply({ statusCode: 200, body: descendingResponse });
            }
        }).as("getComments");

        cy.visit(COMMENTS_URL, {
            onBeforeLoad(win) {
                win.localStorage.setItem("is_logged_in", "true");
                win.localStorage.setItem("username", "user");
            },
        });

        cy.wait("@accountCheck");
        cy.wait("@getComments");

        cy.contains("Comments").should("be.visible");
        cy.contains("Sort:").should("be.visible");
        cy.contains("From:").should("be.visible");
        cy.contains("To:").should("be.visible");

        cy.get('[data-testid="comment"]').should("have.length", 2);
        cy.get('[data-testid="comment"]')
            .eq(0)
            .should("contain", "Newest comment");
        cy.get('[data-testid="comment"]')
            .eq(1)
            .should("contain", "Oldest comment");

        cy.contains("button", "Date descending").click();
        cy.contains("button", "Date ascending").click();

        cy.wait("@getComments");

        cy.get('[data-testid="comment"]')
            .eq(0)
            .should("contain", "Oldest comment");
        cy.get('[data-testid="comment"]')
            .eq(1)
            .should("contain", "Newest comment");

        cy.contains("button", "Date ascending").should("be.visible");
    });

    it("loads comments page with real backend after real login", () => {
        cy.visit("http://localhost:5173/");

        cy.get("#sidebar-link-login").click();
        cy.url().should("include", "/login");

        cy.get("#username").type("magdaCzarnecka");
        cy.get("#password").type("Password1!");
        cy.get('button[type="submit"]').click();

        cy.window().should((win) => {
            expect(win.localStorage.getItem("is_logged_in")).to.eq("true");
            expect(win.localStorage.getItem("username")).to.eq("magdaCzarnecka");
        });

        cy.intercept("GET", "**/user-dashboard/comments*").as(
            "getCommentsReal",
        );

        cy.visit(COMMENTS_URL);

        cy.wait("@accountCheck");
        cy.wait("@getCommentsReal").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body).to.have.property("items");
            expect(interception.response?.body).to.have.property("hasNext");
        });

        cy.contains("Comments").should("be.visible");
    });
});
