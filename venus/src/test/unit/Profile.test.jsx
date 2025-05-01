import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Profile from "../../pages/account/profile/Profile";
import { accountSlice } from "../../redux/account.jsx";
import { describe } from "vitest";

const queryClient = new QueryClient();

vi.mock("@tanstack/react-query", async () => {
  return {
    ...(await vi.importActual("@tanstack/react-query")),
    useQuery: vi.fn(),
  };
});

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
          <Profile />
        </QueryClientProvider>
      </MemoryRouter>
    </Provider>,
  );
};

const mockUserData = {
  username: "User",
  profilePhoto: "mock-photo.jpg",
  followersCount: 1,
  followedCount: 6,
  friendsCount: 5,
  photosCount: 29,
  mostPopularPhotos: [
    {
      src: "photo1.jpg",
      heartsCount: 0,
      viewsCount: 0,
      title: "Statue A",
    },
    {
      src: "photo2.jpg",
      heartsCount: 0,
      viewsCount: 0,
      title: "Statue B",
    },
  ],
};

describe("Profile component unit tests", () => {
  describe("Profile display user data correctly", () => {
    beforeEach(() => {
      useQuery.mockReturnValue({
        data: mockUserData,
        isLoading: false,
        error: null,
      });
      renderProfile();
    });
    test("Should render username", () => {
      expect(screen.getByText("User")).toBeDefined();
    });
    test("Should render profile photo", () => {
      expect(screen.getByAltText("profileImage")?.getAttribute("src")).toBe(
        "mock-photo.jpg",
      );
    });
    describe("Should render followers count", () => {
      test("Text", () => {
        expect(screen.getByText("Followers")).toBeDefined();
      });
      test("Number", () => {
        expect(screen.getByText("1")).toBeDefined();
      });
    });
    describe("Should render followed count", () => {
      test("Text", () => {
        expect(screen.getByText("Followed")).toBeDefined();
      });
      test("Number", () => {
        expect(screen.getByText("6")).toBeDefined();
      });
    });
    describe("Should render friends count", () => {
      test("Text", () => {
        expect(screen.getByText("Friends")).toBeDefined();
      });
      test("Number", () => {
        expect(screen.getByText("5")).toBeDefined();
      });
    });
    describe("Should render photos count", () => {
      test("Text", () => {
        expect(screen.getByText("Photos")).toBeDefined();
      });
      test("Number", () => {
        expect(screen.getByText("29")).toBeDefined();
      });
    });
    test("Should render most popular photos", () => {
      expect(screen.getByAltText("Statue A")).toBeDefined();
    });
  });
});
