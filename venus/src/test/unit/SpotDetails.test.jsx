import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { spotDetailsModalSlice } from "../../redux/spot-modal";
import { spotCommentSlice } from "../../redux/spot-comments";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import SpotDetails from "../../pages/spot/SpotDetails";
import { sidebarSlice } from "../../redux/sidebar";

const queryClient = new QueryClient();

vi.mock("@tanstack/react-query", async () => {
  return {
    ...(await vi.importActual("@tanstack/react-query")),
    useQuery: vi.fn(),
  };
});

const renderSpotDetails = () => {
  const store = configureStore({
    reducer: {
      spotDetails: spotDetailsModalSlice.reducer,
      sidebar: sidebarSlice.reducer,
      spotComments: spotCommentSlice.reducer,
    },
    preloadedState: {
      spotDetails: {
        showModal: true,
        spotId: 1,
      },
      sidebar: {
        isOpen: false,
      },
      spotComments: {
        ids: [],
        entities: {},
      },
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <SpotDetails />
        </QueryClientProvider>
      </MemoryRouter>
    </Provider>,
  );
};

const mockSpotDetailsData = {
  id: 1,
  name: "SpotName",
  country: "Country",
  city: "City",
  street: "Street",
  description: "Description",
  rating: 5.0,
  ratingCount: 20,
  photos: [
    {
      img: "photo1.jpg",
      title: "PhotoTitle1",
      description: "PhotoDescription1",
      likes: 10,
      views: 10,
      author: "Author",
      id: 1,
    },
    {
      img: "photo2.jpg",
      title: "PhotoTitle2",
      description: "PhotoDescription2",
      likes: 20,
      views: 20,
      author: "Author",
      id: 2,
    },
  ],
  weatherApiCallCoords: {
    x: 1,
    y: 1,
  },
  tags: [
    {
      id: 1,
      name: "Tag1",
    },
    {
      id: 2,
      name: "Tag2",
    },
  ],
};

describe("SpotDetails component unit tests", () => {
  describe("Spot details data is displayed correctly", () => {
    beforeEach(() => {
      useQuery.mockReturnValue({
        data: mockSpotDetailsData,
        isLoading: false,
        error: null,
      });
      renderSpotDetails();
    });
    describe("Should render general info", () => {
      test("Spot name", () => {
        expect(screen.getByText("SpotName")).toBeInTheDocument();
      });
      test("Description", () => {
        expect(screen.getByText("Description")).toBeInTheDocument();
      });
      test("Rating", () => {
        expect(screen.getByText("Description")).toBeInTheDocument();
      });
      test("Rating count", () => {
        expect(screen.getByTestId("spot-rating")).toBeInTheDocument();
      });
      test("Tags", () => {
        expect(screen.getByText("Tag1")).toBeInTheDocument();
        expect(screen.getByText("Tag2")).toBeInTheDocument();
      });
    });
    describe("Should render spot address info", () => {
      test("Country", () => {
        expect(screen.getByText(/Country/i)).toBeInTheDocument();
      });
      test("City", () => {
        expect(screen.getByText(/City/i)).toBeInTheDocument();
      });
      test("Street", () => {
        expect(screen.getByText("Street")).toBeInTheDocument();
      });
    });
    test("Should render photos", () => {
      const photos1 = screen.getAllByAltText("PhotoTitle1");
      photos1.forEach((p) => {
        expect(p).toBeInTheDocument();
      });
      const photos2 = screen.getAllByAltText("PhotoTitle2");
      photos2.forEach((p) => {
        expect(p).toBeInTheDocument();
      });
    });
    describe("Should render spot action buttons", () => {
      test("navigate to spot", () => {
        expect(
          screen.getByTestId("navigate-to-spot-button-icon"),
        ).toBeInTheDocument();
      });
      test("save spot", () => {
        expect(screen.getByTestId("save-spot-button-icon")).toBeInTheDocument();
      });
      test("share spot", () => {
        expect(
          screen.getByTestId("share-spot-button-icon"),
        ).toBeInTheDocument();
      });
      test("add photo", () => {
        expect(screen.getByTestId("add-photo-button-icon")).toBeInTheDocument();
      });
    });
  });
});
