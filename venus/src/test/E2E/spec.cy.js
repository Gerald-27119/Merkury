describe("Account E2E tests", () => {
  it("Login", () => {
    cy.visit("http://localhost:5173/");

    cy.contains("Account").click();
    cy.contains("Login").click();

    cy.url().should("include", "/login");

    cy.get("#username").type("user");
    cy.get("#password").type("password");

    cy.contains("Sign In").click();

    cy.contains("Sign out");
  });

  it("Register", () => {
    cy.visit("http://localhost:5173/");

    cy.contains("Account").click();
    cy.contains("Register").click();

    cy.url().should("include", "/register");

    cy.get("#username").type("test");
    cy.get("#email").type("test@gmail.com");
    cy.get("#password").type("Password1@3");
    cy.get("#confirm-password").type("Password1@3");

    cy.contains("Sign up").click();

    cy.contains("Welcome");
  });
});
