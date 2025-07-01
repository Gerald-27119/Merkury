import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "../../../../redux/account";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe } from "vitest";
import { SocialListType } from "../../../../model/enum/account/social/socialListType";
import { socialSlice } from "../../../../redux/social";
import SocialForViewer from "../../../../pages/account/social/SocialForViewer";

const queryClient = new QueryClient();

vi.mock("@tanstack/react-query", async () => {
  return {
    ...(await vi.importActual("@tanstack/react-query")),
    useQuery: vi.fn().mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    }),
  };
});

const renderProfile = () => {
  const store = configureStore({
    reducer: {
      account: accountSlice.reducer,
      social: socialSlice.reducer,
    },
    account: {
      isLogged: true,
    },
    social: {
      type: SocialListType.FRIENDS,
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <SocialForViewer />
        </QueryClientProvider>
      </MemoryRouter>
    </Provider>,
  );
};

describe("Social component unit tests", () => {
  beforeEach(() => {
    renderProfile();
  });

  describe("Should render menu buttons text", () => {
    test("Friends", () => {
      expect(screen.getByText("friends")).toBeInTheDocument();
    });
    test("Followed", () => {
      expect(screen.getByText("followed")).toBeInTheDocument();
    });
    test("Followers", () => {
      expect(screen.getByText("followers")).toBeInTheDocument();
    });
    test("Photos", () => {
      expect(screen.getByText("photos")).toBeInTheDocument();
    });
  });
});
