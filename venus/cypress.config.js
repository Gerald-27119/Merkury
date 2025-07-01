import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:5173",
        specPattern: "src/test/E2E/**/*.cy.js",
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        supportFile: false,
    },
});
