import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider as ReduxProvider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    useMutation,
} from "@tanstack/react-query";
import { accountSlice } from "../../../../redux/account";
import { describe, beforeEach, test, expect, vi } from "vitest";
import Settings from "../../../../pages/account/settings/Settings.tsx";
import { Provider as OauthProvider } from "../../../../model/enum/provider";

const queryClient = new QueryClient();

vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual("@tanstack/react-query");
    return {
        ...actual,
        useQuery: vi.fn(),
        useMutation: vi.fn(),
    };
});

const renderSettings = () => {
    const store = configureStore({
        reducer: {
            account: accountSlice.reducer,
        },
        account: {
            isLogged: true,
        },
    });

    render(
        <ReduxProvider store={store}>
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <Settings />
                </QueryClientProvider>
            </MemoryRouter>
        </ReduxProvider>,
    );
};

const mockClassicUserData = {
    username: "User",
    email: "user@example.com",
    provider: OauthProvider.NONE,
};

const mockOAuthUserData = {
    username: "OauthUser",
    email: "oauth@example.com",
    provider: OauthProvider.GOOGLE,
};

describe("Settings component unit tests", () => {
    describe("Settings display data correctly for classic account", () => {
        beforeEach(() => {
            useQuery.mockReturnValue({
                data: mockClassicUserData,
                isLoading: false,
                error: null,
            });

            useMutation.mockReturnValue({
                mutateAsync: vi.fn(),
            });

            renderSettings();
        });

        test("Should render Settings title", () => {
            expect(screen.getByText("Settings")).toBeDefined();
        });

        test("Should render Account details header", () => {
            expect(screen.getByText("Account details")).toBeDefined();
        });

        describe("Should render disabled fields with user data", () => {
            test("Username field", () => {
                expect(screen.getByText("Your information")).toBeDefined();
                expect(screen.getByDisplayValue("User")).toBeDefined();
            });

            test("Email field", () => {
                expect(screen.getByText("E-mail")).toBeDefined();
                expect(
                    screen.getByDisplayValue("user@example.com"),
                ).toBeDefined();
            });

            test("Password field", () => {
                expect(screen.getByText("Password")).toBeDefined();
                expect(screen.getByDisplayValue("********")).toBeDefined();
            });
        });

        test("Should not render OAuth info box", () => {
            expect(
                screen.queryByText(/Your account was created via/i),
            ).toBeNull();
        });
    });

    describe("Settings display data correctly for OAuth account", () => {
        beforeEach(() => {
            useQuery.mockReturnValue({
                data: mockOAuthUserData,
                isLoading: false,
                error: null,
            });

            useMutation.mockReturnValue({
                mutateAsync: vi.fn(),
            });

            renderSettings();
        });

        test("Should render info that account was created via provider", () => {
            expect(
                screen.getByText(/Your account was created via/i),
            ).toBeDefined();
        });

        test("Should render email and info that it cannot be changed", () => {
            expect(screen.getByText(/oauth@example.com/i)).toBeDefined();
            expect(screen.getByText(/cannot be changed/i)).toBeDefined();
        });

        test("Should not render Account details section", () => {
            expect(screen.queryByText("Account details")).toBeNull();
            expect(screen.queryByText("Your information")).toBeNull();
            expect(screen.queryByText("E-mail")).toBeNull();
            expect(screen.queryByText("Password")).toBeNull();
        });
    });
});
