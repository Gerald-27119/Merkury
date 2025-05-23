import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "../../redux/account.jsx";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe } from "vitest";
import Register from "../../pages/register/Register";

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
          <Register />
        </QueryClientProvider>
      </MemoryRouter>
    </Provider>,
  );
};

describe("Register component unit tests", () => {
  describe("Register display data correctly", () => {
    beforeEach(() => {
      renderProfile();
    });

    test("Should render header", () => {
      expect(
        screen.getByRole("heading", { name: /create account/i }),
      ).toBeInTheDocument();
    });

    describe("Should render inputs", () => {
      test("Username", () => {
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      });

      test("E-mail", () => {
        expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
      });

      test("Password", () => {
        expect(screen.getByLabelText("password")).toBeInTheDocument();
      });

      test("Confirm Password", () => {
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      });
    });

    describe("Should render button", () => {
      test("Sign Up", () => {
        expect(
          screen.getByRole("button", { name: /sign up/i }),
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

    describe("Should render Link", () => {
      test("Text", () => {
        expect(
          screen.getByText(/already have an account\?/i),
        ).toBeInTheDocument();
      });
      test("Link", () => {
        const link = screen.getByText(/already have an account\?/i);
        expect(link.closest("a")).toHaveAttribute("href", "/login");
      });
    });
  });
});
