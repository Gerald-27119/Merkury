import React from "react";
import { describe, test, beforeEach, vi, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { Provider as ReduxProvider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { accountSlice } from "../../../redux/account.tsx";
import Settings from "../../../pages/account/settings/Settings.tsx";
import { getUserData } from "../../../http/user-dashboard";
import { Provider as ProviderEnum } from "../../../model/enum/provider";

vi.mock("../../../http/user-dashboard", () => ({
    getUserData: vi.fn(),
    editUserSettings: vi.fn(),
}));

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

const renderSettings = () => {
    const store = configureStore({
        reducer: {
            account: accountSlice.reducer,
        },
        preloadedState: {
            account: { isLogged: true },
        },
    });

    const queryClient = createTestQueryClient();

    return render(
        <ReduxProvider store={store}>
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <Settings />
                </QueryClientProvider>
            </MemoryRouter>
        </ReduxProvider>,
    );
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("Settings – integration tests", () => {
    test("opens username edit form when clicking Edit on username", async () => {
        getUserData.mockResolvedValueOnce({
            username: "testUser",
            email: "test@example.com",
            provider: ProviderEnum.NONE,
        });

        renderSettings();

        expect(await screen.findByText("Account details")).toBeInTheDocument();

        const user = userEvent.setup();
        const editButtons = screen.getAllByText("Edit");

        await user.click(editButtons[0]);

        expect(
            screen.getByRole("heading", { name: "Change username" }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });

    test("opens e-mail edit form when clicking Edit on e-mail", async () => {
        getUserData.mockResolvedValueOnce({
            username: "testUser",
            email: "test@example.com",
            provider: ProviderEnum.NONE,
        });

        renderSettings();

        expect(await screen.findByText("Account details")).toBeInTheDocument();

        const user = userEvent.setup();
        const editButtons = screen.getAllByText("Edit");

        await user.click(editButtons[1]);

        expect(
            screen.getByRole("heading", { name: "Change e-mail" }),
        ).toBeInTheDocument();

        const emailInputs = screen.getAllByLabelText(/e-mail/i);
        expect(emailInputs[1]).toBeInTheDocument();
    });

    test("opens password edit form when clicking Edit on password", async () => {
        getUserData.mockResolvedValueOnce({
            username: "testUser",
            email: "test@example.com",
            provider: ProviderEnum.NONE,
        });

        renderSettings();

        expect(await screen.findByText("Account details")).toBeInTheDocument();

        const user = userEvent.setup();
        const editButtons = screen.getAllByText("Edit");

        await user.click(editButtons[2]);

        expect(
            screen.getByRole("heading", { name: "Change password" }),
        ).toBeInTheDocument();

        expect(screen.getByLabelText(/old password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });
});
