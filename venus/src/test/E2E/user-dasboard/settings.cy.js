Cypress.on("uncaught:exception", (err) => {
    if (
        err.message.includes(
            "Cannot read properties of null (reading 'document')",
        )
    ) {
        return false;
    }
});

describe("Account settings page", () => {
    const SETTINGS_URL = "http://localhost:5173/account/settings";

    const visitSettingsAsLoggedIn = () => {
        cy.visit(SETTINGS_URL, {
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

    it("shows account details for a normal account and opens username edit form", () => {
        cy.intercept("GET", "**/user-dashboard/settings*", {
            statusCode: 200,
            body: {
                username: "user",
                email: "user@example.com",
                provider: "NONE",
            },
        }).as("getSettings");

        visitSettingsAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getSettings");

        cy.contains("Settings").should("be.visible");
        cy.contains("Account details").should("be.visible");

        cy.get("#disabled-your-information").should("have.value", "user");
        cy.get("#disabled-email").should("have.value", "user@example.com");
        cy.get("#disabled-password").should("have.value", "********");

        cy.get("#disabled-your-information")
            .parent()
            .find("button")
            .contains("Edit")
            .click();

        cy.contains("Change username").should("be.visible");
        cy.get("#username").should("be.visible");
    });

    it("submits username change successfully", () => {
        cy.intercept("GET", "**/user-dashboard/settings*", {
            statusCode: 200,
            body: {
                username: "user",
                email: "user@example.com",
                provider: "NONE",
            },
        }).as("getSettings");

        cy.intercept("PATCH", "**/user-dashboard/settings*", (req) => {
            expect(req.body.type).to.eq("USERNAME");
            expect(req.body.provider).to.eq("NONE");
            expect(req.body.username).to.eq("new-username");
            req.reply({ statusCode: 200 });
        }).as("editSettings");

        visitSettingsAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getSettings");

        cy.get("#disabled-your-information")
            .parent()
            .find("button")
            .contains("Edit")
            .click();

        cy.contains("Change username").should("be.visible");

        cy.get("#username").clear().type("new-username");

        cy.contains("button", "Save").click();

        cy.wait("@editSettings");

        cy.contains("Successfully change your username").should("be.visible");
    });

    it("submits email change successfully", () => {
        cy.intercept("GET", "**/user-dashboard/settings*", {
            statusCode: 200,
            body: {
                username: "user",
                email: "user@example.com",
                provider: "NONE",
            },
        }).as("getSettings");

        cy.intercept("PATCH", "**/user-dashboard/settings*", (req) => {
            expect(req.body.type).to.eq("EMAIL");
            expect(req.body.provider).to.eq("NONE");
            expect(req.body.email).to.eq("new@example.com");
            req.reply({ statusCode: 200 });
        }).as("editSettings");

        visitSettingsAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getSettings");

        cy.get("#disabled-email")
            .parent()
            .find("button")
            .contains("Edit")
            .click();

        cy.contains("Change e-mail").should("be.visible");

        cy.get("#email").clear().type("new@example.com");

        cy.contains("button", "Save").click();

        cy.wait("@editSettings");

        cy.contains("Successfully change your email").should("be.visible");
    });

    it("submits password change successfully", () => {
        cy.intercept("GET", "**/user-dashboard/settings*", {
            statusCode: 200,
            body: {
                username: "user",
                email: "user@example.com",
                provider: "NONE",
            },
        }).as("getSettings");

        cy.intercept("PATCH", "**/user-dashboard/settings*", (req) => {
            expect(req.body.type).to.eq("PASSWORD");
            expect(req.body.provider).to.eq("NONE");
            expect(req.body.oldPassword).to.eq("OldPassword1!");
            expect(req.body.newPassword).to.eq("NewPassword1!");
            expect(req.body.confirmPassword).to.eq("NewPassword1!");
            req.reply({ statusCode: 200 });
        }).as("editSettings");

        visitSettingsAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getSettings");

        cy.get("#disabled-password")
            .parent()
            .find("button")
            .contains("Edit")
            .click();

        cy.contains("Change password").should("be.visible");

        cy.get("#oldPassword").type("OldPassword1!");
        cy.get("#newPassword").type("NewPassword1!");
        cy.get("#confirmPassword").type("NewPassword1!");

        cy.contains("button", "Save").click();

        cy.wait("@editSettings");

        cy.contains("Successfully change your password").should("be.visible");
    });

    it("shows limited settings for oauth provider", () => {
        cy.intercept("GET", "**/user-dashboard/settings*", {
            statusCode: 200,
            body: {
                username: "oauth-user",
                email: "oauth@example.com",
                provider: "GOOGLE",
            },
        }).as("getSettingsOauth");

        visitSettingsAsLoggedIn();

        cy.wait("@accountCheck");
        cy.wait("@getSettingsOauth");

        cy.contains("Your account was created via GOOGLE").should("be.visible");
        cy.contains("Your email address is oauth@example.com").should(
            "be.visible",
        );

        cy.contains("Account details").should("not.exist");
        cy.contains("Change username").should("not.exist");
        cy.contains("Change e-mail").should("not.exist");
        cy.contains("Change password").should("not.exist");
    });

    it("shows settings for real user after real login", () => {
        cy.visit("http://localhost:5173/");

        cy.get("#sidebar-link-login").click();
        cy.url().should("include", "/login");

        cy.get("#username").type("user");
        cy.get("#password").type("password");
        cy.get('button[type="submit"]').click();

        cy.url().should("not.include", "/login");

        cy.intercept("GET", "**/user-dashboard/settings*").as(
            "getSettingsReal",
        );

        cy.visit(SETTINGS_URL);

        cy.wait("@getSettingsReal");

        cy.contains("Settings").should("be.visible");
        cy.contains("Account details").should("be.visible");
        cy.get("#disabled-your-information").should("exist");
        cy.get("#disabled-email").should("exist");
    });
});
