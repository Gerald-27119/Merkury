import { render, screen } from "@testing-library/react";
import { describe } from "vitest";
import SocialCard from "../../../../pages/account/social/components/SocialCard.js";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "../../../../redux/account.jsx";

const mockFriendsData = {
  username: "User 1",
  profilePhoto: "user1.jpg",
};

const queryClient = new QueryClient();

const renderProfile = () => {
  const store = configureStore({
    reducer: {
      account: accountSlice.reducer,
    },
    account: {
      isLogged: true,
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <SocialCard friend={mockFriendsData} />
        </QueryClientProvider>
      </MemoryRouter>
    </Provider>,
  );
};

describe("Friend Card component unit tests", () => {
  describe("Display friends data correctly", () => {
    beforeEach(() => {
      renderProfile();
    });

    test("Should render username", () => {
      expect(screen.getByText("User 1")).toBeInTheDocument();
    });
    test("Should render profile photo", () => {
      expect(screen.getByAltText("profileImage")?.getAttribute("src")).toBe(
        "user1.jpg",
      );
    });

    describe("Should render menu buttons text", () => {
      test("Friends", () => {
        expect(
          screen.getByLabelText("userProfileFriendCardIcon"),
        ).toBeInTheDocument();
      });
      test("Followed", () => {
        expect(
          screen.getByLabelText("messageFriendCardIcon"),
        ).toBeInTheDocument();
      });
      test("Followers", () => {
        expect(
          screen.getByLabelText("userRemoveFriendCardIcon"),
        ).toBeInTheDocument();
      });
    });
  });
});
