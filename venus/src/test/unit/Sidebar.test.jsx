import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import { accountSlice } from "../../redux/account";
import Sidebar from "../../layout/sidebar/Sidebar";
import { sidebarSlice } from "../../redux/sidebar";

const queryClient = new QueryClient();

const renderSidebar = (preloadedState, pathname) => {
    const store = configureStore({
        reducer: {
            account: accountSlice.reducer,
            sidebar: sidebarSlice.reducer,
        },
        preloadedState,
    });

    render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[pathname]}>
                <QueryClientProvider client={queryClient}>
                    <Sidebar />
                </QueryClientProvider>
            </MemoryRouter>
        </Provider>,
    );
};

describe("Sidebar component unit tests", () => {
    describe("When sidebar is close and user is not logged", () => {
        beforeEach(() => {
            renderSidebar(
                {
                    account: {
                        isLogged: false,
                    },
                    sidebar: {
                        isOpen: false,
                    },
                },
                "/",
            );
        });

        describe("Check is links render", () => {
            test("should render Home Link", () => {
                const links = screen.getAllByRole("link");
                const link = links.find(
                    (link) => link.getAttribute("href") === "/",
                );
                expect(link).toBeInTheDocument();
            });

            test("should render Map link", () => {
                const links = screen.getAllByRole("link");
                const link = links.find(
                    (link) => link.getAttribute("href") === "/map",
                );
                expect(link).toBeInTheDocument();
            });

            test("should render Forum link", () => {
                const links = screen.getAllByRole("link");
                const link = links.find(
                    (link) => link.getAttribute("href") === "/forum",
                );
                expect(link).toBeInTheDocument();
            });

            test("should render Login link", () => {
                const links = screen.getAllByRole("link");
                const link = links.find(
                    (link) => link.getAttribute("href") === "/login",
                );
                expect(link).toBeInTheDocument();
            });
        });

        describe("Check is icons render", () => {
            test("should render Home icon", () => {
                const icon = screen.getByLabelText("home");
                expect(icon).toBeInTheDocument();
            });

            test("should render MapPage icon", () => {
                const icon = screen.getByLabelText("map");
                expect(icon).toBeInTheDocument();
            });

            test("should render Forum icon", () => {
                const icon = screen.getByLabelText("forum");
                expect(icon).toBeInTheDocument();
            });

            test("should render Login icon", () => {
                const icon = screen.getByLabelText("login");
                expect(icon).toBeInTheDocument();
            });

            test("should render Change mode icon", () => {
                const icon = screen.getByLabelText("changeMode");
                expect(icon).toBeInTheDocument();
            });
        });
    });

    describe("When sidebar is closed and user is logged", () => {
        beforeEach(() => {
            renderSidebar(
                {
                    account: {
                        isLogged: true,
                    },
                },
                "/",
            );
        });

        describe("Check is links render", () => {
            test("should render Account link", () => {
                const links = screen.getAllByRole("link");
                const link = links.find(
                    (link) => link.getAttribute("href") === "/account/profile",
                );
                expect(link).toBeInTheDocument();
            });
        });
    });

    describe("When sidebar is open and user is not logged", () => {
        beforeEach(() => {
            renderSidebar(
                {
                    account: {
                        isLogged: false,
                    },
                    sidebar: {
                        isOpen: true,
                    },
                },
                "/",
            );
        });

        describe("Check is text render", () => {
            test("should render Home Text", () => {
                const text = screen.getByText("home");
                expect(text).toBeInTheDocument();
            });

            test("should render MapPage Text", () => {
                const text = screen.getByText("map");
                expect(text).toBeInTheDocument();
            });

            test("should render Forum Text", () => {
                const text = screen.getByText("forum");
                expect(text).toBeInTheDocument();
            });

            test("should render Login Text", () => {
                const text = screen.getByText("login");
                expect(text).toBeInTheDocument();
            });
        });
    });

    describe("When sidebar is open and user is logged on account page", () => {
        beforeEach(() => {
            renderSidebar(
                {
                    account: {
                        isLogged: true,
                    },
                    sidebar: {
                        isOpen: true,
                    },
                },
                "/account/profile",
            );
        });

        describe("Check is text render", () => {
            test("should render Profile Text", () => {
                const text = screen.getByText("profile");
                expect(text).toBeInTheDocument();
            });

            test("should render Spots Text", () => {
                const text = screen.getByText("spots");
                expect(text).toBeInTheDocument();
            });

            test("should render Photos Text", () => {
                const text = screen.getByText("photos");
                expect(text).toBeInTheDocument();
            });

            test("should render Movies Text", () => {
                const text = screen.getByText("movies");
                expect(text).toBeInTheDocument();
            });

            test("should render friends Text", () => {
                const text = screen.getByText("social");
                expect(text).toBeInTheDocument();
            });

            test("should render Add spot Text", () => {
                const text = screen.getByText("add spot");
                expect(text).toBeInTheDocument();
            });

            test("should render Comments Text", () => {
                const text = screen.getByText("comments");
                expect(text).toBeInTheDocument();
            });

            test("should render Settings Text", () => {
                const text = screen.getByText("settings");
                expect(text).toBeInTheDocument();
            });
        });
    });
});
