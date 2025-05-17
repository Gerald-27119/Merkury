import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "../../redux/account.jsx";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe } from "vitest";
import Login from "../../pages/login/Login";

const queryClient = new QueryClient();

const renderProfile = () => {
  const store = configureStore({
    reducer: {
      account: accountSlice.reducer,
    },
    account: {
      isLogged: false,
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <Login />
        </QueryClientProvider>
      </MemoryRouter>
    </Provider>,
  );
};

describe("Login component unit tests", () => {
  describe("Login display data correctly", () => {
    beforeEach(() => {
      renderProfile();
    });

    test("Should render header", () => {
      expect(
        screen.getByRole("heading", { name: /sign in/i }),
      ).toBeInTheDocument();
    });

    describe("Should render inputs", () => {
      test("Username", () => {
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      });

      test("Password", () => {
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      });
    });

    describe("Should render button", () => {
      test("Sign In", () => {
        expect(
          screen.getByRole("button", { name: /sign in/i }),
        ).toBeInTheDocument();
      });
    });

    describe("Should render Oauth part", () => {
      test("OR", () => {
        expect(screen.getByText("or")).toBeInTheDocument();
      });

      describe("Should render Google button", () => {
        test("Icon", () => {
          expect(screen.getByLabelText("googleIcon")).toBeInTheDocument();
        });
        test("Text", () => {
          expect(
            screen.getByText(/Continue with Google account./i),
          ).toBeInTheDocument();
        });
      });

      describe("Should render Github button", () => {
        test("Icon", () => {
          expect(screen.getByLabelText("githubIcon")).toBeInTheDocument();
        });
        test("Text", () => {
          expect(
            screen.getByText(/Continue with Github account./i),
          ).toBeInTheDocument();
        });
      });
    });

    describe("Should render Links", () => {
      describe("Dont' have an account?", () => {
        test("Text", () => {
          expect(
            screen.getByText(/don't have an account\?/i),
          ).toBeInTheDocument();
        });
        test("Link", () => {
          const link = screen.getByText(/don't have an account\?/i);
          expect(link.closest("a")).toHaveAttribute("href", "/register");
        });
      });

      describe("Forgot Password?", () => {
        test("Text", () => {
          expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
        });
        test("Link", () => {
          const link = screen.getByText(/forgot password\?/i);
          expect(link.closest("a")).toHaveAttribute("href", "/forgot-password");
        });
      });
    });
  });
});
