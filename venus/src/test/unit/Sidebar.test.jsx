import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import { accountSlice } from "../../redux/account.jsx";
import Sidebar from "../../layout/sidebar/Sidebar.jsx";

const queryClient = new QueryClient();

const renderSidebar = () => {
  const store = configureStore({
    reducer: {
      account: accountSlice.reducer,
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <Sidebar />
        </QueryClientProvider>
      </MemoryRouter>
    </Provider>,
  );
};

describe("Header component unit tests", () => {
  describe("When header is small", () => {
    beforeEach(() => {
      renderSidebar();
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
          (link) => link.getAttribute("href") === "/login",
        );
        expect(accountLink).toBeInTheDocument();
      });

      test("should render Change mode button", () => {
        const changeModeButton = screen.getByLabelText("changeMode");
        expect(changeModeButton).toBeInTheDocument();
      });
    });

    describe("Check is icons render", () => {
      test("should render Home icon", () => {
        const notificationIcon = screen.getByLabelText("home");
        expect(notificationIcon).toBeInTheDocument();
      });

      test("should render Map icon", () => {
        const mapIcon = screen.getByLabelText("map");
        expect(mapIcon).toBeInTheDocument();
      });

      test("should render Forum icon", () => {
        const forumIcon = screen.getByLabelText("forum");
        expect(forumIcon).toBeInTheDocument();
      });

      test("should render Chat icon", () => {
        const chatIcon = screen.getByLabelText("chat");
        expect(chatIcon).toBeInTheDocument();
      });

      test("should render Spots List icon", () => {
        const spotsListIcon = screen.getByLabelText("spotsList");
        expect(spotsListIcon).toBeInTheDocument();
      });

      test("should render Notification icon", () => {
        const notificationIcon = screen.getByLabelText("notification");
        expect(notificationIcon).toBeInTheDocument();
      });

      test("should render Account icon", () => {
        const accountIcon = screen.getByLabelText("account");
        expect(accountIcon).toBeInTheDocument();
      });
    });
  });
});
