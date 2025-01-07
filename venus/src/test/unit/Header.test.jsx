import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Header from "../../layout/header/Header.jsx";
import { accountSlice } from "../../redux/account.jsx";

const queryClient = new QueryClient();

describe("Header component unit tests", () => {
  test("Render when user is logged in", () => {
    const store = configureStore({
      reducer: {
        account: accountSlice.reducer,
      },
      preloadedState: {
        account: {
          isLogged: true,
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <Header />
          </QueryClientProvider>
        </MemoryRouter>
      </Provider>,
    );

    const signOutButton = screen.getByText(/Sign out/i);
    const forum = screen.getByText(/Forum/i);

    expect(signOutButton).toBeInTheDocument();
    expect(forum).toBeInTheDocument();
  });

  test("Render when user is not logged in", () => {
    const store = configureStore({
      reducer: {
        account: accountSlice.reducer,
      },
      preloadedState: {
        account: {
          isLogged: false,
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <Header />
          </QueryClientProvider>
        </MemoryRouter>
      </Provider>,
    );

    const signOutButton = screen.queryByText(/Sign out/i);
    const forumButton = screen.queryByText(/Forum/i);
    const accountButton = screen.getByText(/Account/i);

    expect(signOutButton).not.toBeInTheDocument();
    expect(forumButton).not.toBeInTheDocument();
    expect(accountButton).toBeInTheDocument();
  });
});
