Cypress.on("uncaught:exception", (err, runnable) => {
    if (
        err.message.includes(
            "Cannot read properties of null (reading 'document')",
        )
    ) {
        return false;
    }
});

describe("Account E2E tests", () => {
    it("Login", () => {
        cy.visit("http://localhost:5173/");

        cy.get("#login").click();

        cy.url().should("include", "/login");

        cy.get("#username").type("user");
        cy.get("#password").type("password");

        cy.get('button[type="submit"]').click();
    });

    it("Register", () => {
        cy.visit("http://localhost:5173/");

        cy.get("#login").click();
        cy.contains("Don't have an account?").click();

        cy.url().should("include", "/register");

        cy.get("#username").type("test2");
        cy.get("#email").type("test2@gmail.com");
        cy.get("#password").type("Password1@3");
        cy.get("#confirm-password").type("Password1@3");

        cy.get('button[type="submit"]').click();
    });
});
