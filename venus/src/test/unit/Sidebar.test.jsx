import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import { accountSlice } from "../../redux/account.jsx";
import Sidebar from "../../layout/sidebar/Sidebar.tsx";

const queryClient = new QueryClient();

const renderSidebar = (preloadedState, pathname) => {
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

      test("should render MapPage link", () => {
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

      test("should render Spots List link", () => {
        const links = screen.getAllByRole("link");
        const link = links.find(
          (link) => link.getAttribute("href") === "/spots-list",
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

      test("should render Spots List icon", () => {
        const icon = screen.getByLabelText("spotsList");
        expect(icon).toBeInTheDocument();
      });

      test("should render Notification icon", () => {
        const icon = screen.getByLabelText("notification");
        expect(icon).toBeInTheDocument();
      });

      test("should render Account icon", () => {
        const icon = screen.getByLabelText("account");
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

      test("should render Favorites spots Text", () => {
        const text = screen.getByText("favorites spots");
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

  describe("When sidebar is close and user is logged on account page", () => {
    beforeEach(() => {
      renderSidebar(
        {
          account: {
            isLogged: true,
          },
        },
        "/account/profile",
      );
    });

    describe("Check is links render", () => {
      test("should render Profile Link", () => {
        const links = screen.getAllByRole("link");
        const link = links.find(
          (link) => link.getAttribute("href") === "/account/profile",
        );
        expect(link).toBeInTheDocument();
      });

      test("should render Spots List Link", () => {
        Object.assign(window, { innerWidth: 1920 });
        window.dispatchEvent(new Event("resize"));
        const links = screen.getAllByRole("link");
        const link = links.find(
          (link) => link.getAttribute("href") === "/account/spots-list",
        );
        expect(link).toBeInTheDocument();
      });

      test("should render Photos list Link", () => {
        const links = screen.getAllByRole("link");
        const link = links.find(
          (link) => link.getAttribute("href") === "/account/photos-list",
        );
        expect(link).toBeInTheDocument();
      });

      test("should render Movies list Link", () => {
        const links = screen.getAllByRole("link");
        const link = links.find(
          (link) => link.getAttribute("href") === "/account/movies-list",
        );
        expect(link).toBeInTheDocument();
      });

      test("should render friends Link", () => {
        const links = screen.getAllByRole("link");
        const link = links.find(
          (link) => link.getAttribute("href") === "/account/friends",
        );
        expect(link).toBeInTheDocument();
      });

      test("should render Add spot Link", () => {
        const links = screen.getAllByRole("link");
        const link = links.find(
          (link) => link.getAttribute("href") === "/account/add-spot",
        );
        expect(link).toBeInTheDocument();
      });

      test("should render Comments Link", () => {
        const links = screen.getAllByRole("link");
        const link = links.find(
          (link) => link.getAttribute("href") === "/account/comments",
        );
        expect(link).toBeInTheDocument();
      });

      test("should render Settings Link", () => {
        screen.debug();
        const links = screen.getAllByRole("link");
        const link = links.find(
          (link) => link.getAttribute("href") === "/account/settings",
        );
        expect(link).toBeInTheDocument();
      });
    });

    describe("Check is icons render", () => {
      test("should render Profile icon", () => {
        const icon = screen.getByLabelText("profile");
        expect(icon).toBeInTheDocument();
      });

      test("should render Spots list icon", () => {
        const icon = screen.getByLabelText("accountSpotsList");
        expect(icon).toBeInTheDocument();
      });

      test("should render Photos List icon", () => {
        const icon = screen.getByLabelText("photosList");
        expect(icon).toBeInTheDocument();
      });

      test("should render Movies List icon", () => {
        const icon = screen.getByLabelText("moviesList");
        expect(icon).toBeInTheDocument();
      });

      test("should render Friends icon", () => {
        const icon = screen.getByLabelText("friends");
        expect(icon).toBeInTheDocument();
      });

      test("should render Add Spot icon", () => {
        const icon = screen.getByLabelText("addSpot");
        expect(icon).toBeInTheDocument();
      });

      test("should render Comments icon", () => {
        const icon = screen.getByLabelText("comments");
        expect(icon).toBeInTheDocument();
      });

      test("should render settings icon", () => {
        const icon = screen.getByLabelText("settings");
        expect(icon).toBeInTheDocument();
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
        },
        "/account/profile",
      );
    });

    describe("Check is text render", () => {
      test("should render Profile Text", () => {
        const text = screen.getByText("profile");
        expect(text).toBeInTheDocument();
      });

      test("should render Spots List Text", () => {
        const text = screen.getByText("spots list");
        expect(text).toBeInTheDocument();
      });

      test("should render Photos list Text", () => {
        const text = screen.getByText("photos list");
        expect(text).toBeInTheDocument();
      });

      test("should render Movies list Text", () => {
        const text = screen.getByText("movies list");
        expect(text).toBeInTheDocument();
      });

      test("should render friends Text", () => {
        const text = screen.getByText("friends");
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
