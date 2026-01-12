import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:5173",
        specPattern: "src/test/E2E/**/*.cy.js",
        viewportWidth: 1920,
        viewportHeight: 1080,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        supportFile: false,
    },
});
