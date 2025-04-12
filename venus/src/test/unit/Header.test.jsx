import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Header from "../../layout/header/Header.jsx";
import { accountSlice } from "../../redux/account.jsx";

const queryClient = new QueryClient();

const renderHeader = () => {
  const store = configureStore({
    reducer: {
      account: accountSlice.reducer,
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
};

describe("Header component unit tests", () => {
  describe("When header is small", () => {
    beforeEach(() => {
      renderHeader();
    });

    describe("Check is links/buttons render", () => {
      test("should render Home Link", () => {
        const links = screen.getAllByRole("link");
        const homeLink = links.find(
          (link) => link.getAttribute("href") === "/",
        );
        expect(homeLink).toBeInTheDocument();
      });

      test("should render Map link", () => {
        const links = screen.getAllByRole("link");
        const mapLink = links.find(
          (link) => link.getAttribute("href") === "/map",
        );
        expect(mapLink).toBeInTheDocument();
      });

      test("should render Forum link", () => {
        const links = screen.getAllByRole("link");
        const forumLink = links.find(
          (link) => link.getAttribute("href") === "/forum",
        );
        expect(forumLink).toBeInTheDocument();
      });

      test("should render Chat link", () => {
        const links = screen.getAllByRole("link");
        const chatLink = links.find(
          (link) => link.getAttribute("href") === "/chat",
        );
        expect(chatLink).toBeInTheDocument();
      });

      test("should render Spots List link", () => {
        const links = screen.getAllByRole("link");
        const spotsListLink = links.find(
          (link) => link.getAttribute("href") === "/spots-list",
        );
        expect(spotsListLink).toBeInTheDocument();
      });

      test("should render Account link", () => {
        const links = screen.getAllByRole("link");
        const accountLink = links.find(
          (link) => link.getAttribute("href") === "/account",
        );
        expect(accountLink).toBeInTheDocument();
      });

      test("should render Change mode button", () => {
        const changeModeButton = screen.getByTitle("changeMode");
        expect(changeModeButton).toBeInTheDocument();
      });
    });

    describe("Check is icons render", () => {
      test("should render Home icon", () => {
        const notificationIcon = screen.getByTitle("home");
        expect(notificationIcon).toBeInTheDocument();
      });

      test("should render Map icon", () => {
        const mapIcon = screen.getByTitle("map");
        expect(mapIcon).toBeInTheDocument();
      });

      test("should render Forum icon", () => {
        const forumIcon = screen.getByTitle("forum");
        expect(forumIcon).toBeInTheDocument();
      });

      test("should render Chat icon", () => {
        const chatIcon = screen.getByTitle("chat");
        expect(chatIcon).toBeInTheDocument();
      });

      test("should render Spots List icon", () => {
        const spotsListIcon = screen.getByTitle("spotsList");
        expect(spotsListIcon).toBeInTheDocument();
      });

      test("should render Notification icon", () => {
        const notificationIcon = screen.getByTitle("notification");
        expect(notificationIcon).toBeInTheDocument();
      });

      test("should render Account icon", () => {
        const accountIcon = screen.getByTitle("account");
        expect(accountIcon).toBeInTheDocument();
      });
    });
  });
});
