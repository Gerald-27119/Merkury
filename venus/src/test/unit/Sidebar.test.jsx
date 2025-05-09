import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import { accountSlice } from "../../redux/account.jsx";
import Sidebar from "../../layout/sidebar/Sidebar.tsx";

const queryClient = new QueryClient();

const renderSidebar = (preloadedState, pathname, isSidebarOpen = false) => {
  const store = configureStore({
    reducer: {
      account: accountSlice.reducer,
    },
    preloadedState,
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[pathname]}>
        <QueryClientProvider client={queryClient}>
          <Sidebar isSidebarOpen={isSidebarOpen} onToggle={() => {}} />
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
        },
        "/",
      );
    });

    describe("Check is links render", () => {
      test("should render Home Link", () => {
        const links = screen.getAllByRole("link");
        const link = links.find((link) => link.getAttribute("href") === "/");
        expect(link).toBeInTheDocument();
      });

      test("should render Map link", () => {
        const links = screen.getAllByRole("link");
        const link = links.find((link) => link.getAttribute("href") === "/map");
        expect(link).toBeInTheDocument();
      });

      test("should render Forum link", () => {
        const links = screen.getAllByRole("link");
        const link = links.find(
          (link) => link.getAttribute("href") === "/forum",
        );
        expect(link).toBeInTheDocument();
      });

      test("should render Chat link", () => {
        const links = screen.getAllByRole("link");
        const link = links.find(
          (link) => link.getAttribute("href") === "/chat",
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

      test("should render Chat icon", () => {
        const icon = screen.getByLabelText("chat");
        expect(icon).toBeInTheDocument();
      });

      test("should render Notification icon", () => {
        const icon = screen.getByLabelText("notification");
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

  describe("When sidebar is close and user is logged", () => {
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

      test("should render Favorite spots link", () => {
        const links = screen.getAllByRole("link");
        const link = links.find(
          (link) => link.getAttribute("href") === "/spots-list",
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
        },
        "/",
        true,
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

      test("should render Chat Text", () => {
        const text = screen.getByText("chat");
        expect(text).toBeInTheDocument();
      });

      test("should render Notification Text", () => {
        const text = screen.getByText("notification");
        expect(text).toBeInTheDocument();
      });

      test("should render Login Text", () => {
        const text = screen.getByText("login");
        expect(text).toBeInTheDocument();
      });
    });
  });
});
