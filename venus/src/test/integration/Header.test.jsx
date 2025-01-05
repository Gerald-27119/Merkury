import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "../../layout/header/Header.jsx";
import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "../../redux/account.jsx";
import userEvent from "@testing-library/user-event";

const queryClient = new QueryClient();

describe("Header component integration tests", () => {
  test("Check is navigation to account page works", async () => {
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
        <MemoryRouter initialEntries={["/"]}>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/" element={<Header />} />
              <Route path="/account" element={<div>Account Page</div>} />
            </Routes>
          </QueryClientProvider>
        </MemoryRouter>
      </Provider>,
    );

    const accountButton = screen.getByText(/Account/i);
    await userEvent.click(accountButton);

    const accountPageText = await screen.findByText(/Account Page/i);
    expect(accountPageText).toBeInTheDocument();
  });
});
