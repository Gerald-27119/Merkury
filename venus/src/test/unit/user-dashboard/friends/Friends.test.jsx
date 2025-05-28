import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "../../../../redux/account";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe } from "vitest";
import Social from "../../../../pages/account/social/Social.tsx";

const queryClient = new QueryClient();

vi.mock("@tanstack/react-query", async () => {
  const mockFriendsData = [
    {
      username: "User 1",
      profilePhoto: "user1.jpg",
    },
    {
      username: "User 2",
      profilePhoto: "user2.jpg",
    },
    {
      username: "User 3",
      profilePhoto: "user3.jpg",
    },
    {
      username: "User 4",
      profilePhoto: "user4.jpg",
    },
    {
      username: "User 5",
      profilePhoto: "user5.jpg",
    },
  ];

  return {
    ...(await vi.importActual("@tanstack/react-query")),
    useQuery: vi.fn().mockReturnValue({
      data: mockFriendsData,
      isLoading: false,
      error: null,
    }),
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
          <Social />
        </QueryClientProvider>
      </MemoryRouter>
    </Provider>,
  );
};

describe("Friends component unit tests", () => {
  describe("Friends display friends data correctly", () => {
    beforeEach(() => {
      renderProfile();
    });

    describe("Should render all friend cards", () => {
      describe("Should render first user friend card", () => {
        test("Should render username", () => {
          expect(screen.getByText("User 1")).toBeInTheDocument();
        });
        test("Should render profile photo", () => {
          const images = screen.getAllByAltText("profileImage");
          expect(images[0]?.getAttribute("src")).toBe("user1.jpg");
        });
      });

      describe("Should render second user friend card", () => {
        test("Should render username", () => {
          expect(screen.getByText("User 2")).toBeInTheDocument();
        });
        test("Should render profile photo", () => {
          const images = screen.getAllByAltText("profileImage");
          expect(images[1]?.getAttribute("src")).toBe("user2.jpg");
        });
      });

      describe("Should render third user friend card", () => {
        test("Should render username", () => {
          expect(screen.getByText("User 3")).toBeInTheDocument();
        });
        test("Should render profile photo", () => {
          const images = screen.getAllByAltText("profileImage");
          expect(images[2]?.getAttribute("src")).toBe("user3.jpg");
        });
      });

      describe("Should render fourth user friend card", () => {
        test("Should render username", () => {
          expect(screen.getByText("User 4")).toBeInTheDocument();
        });
        test("Should render profile photo", () => {
          const images = screen.getAllByAltText("profileImage");
          expect(images[3]?.getAttribute("src")).toBe("user4.jpg");
        });
      });

      describe("Should render fifth user friend card", () => {
        test("Should render username", () => {
          expect(screen.getByText("User 5")).toBeInTheDocument();
        });
        test("Should render profile photo", () => {
          const images = screen.getAllByAltText("profileImage");
          expect(images[4]?.getAttribute("src")).toBe("user5.jpg");
        });
      });
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
    });

    test("Should render h1 text", () => {
      expect(screen.getByText("social list")).toBeInTheDocument();
    });
  });
});
