import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { spotDetailsModalSlice } from "../../redux/spot-modal";
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
    },
    spotDetails: {
      showModal: true,
      spotId: 1,
    },
    sidebar: {
      isOpen: false,
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
    },
    {
      img: "photo2.jpg",
      title: "PhotoTitle2",
      description: "PhotoDescription2",
      likes: 20,
      views: 20,
      author: "Author",
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
        expect(screen.getByText("SpotName")).toBeDefined();
      });
      test("Description", () => {
        expect(screen.getByText("Description")).toBeDefined();
      });
      test("Rating", () => {
        expect(screen.getByText("Description")).toBeDefined();
      });
      test("Rating count", () => {
        expect(screen.getByTestId("spot-rating")).toBeDefined();
      });
      test("Tags", () => {
        expect(screen.getByText("Tag1")).toBeDefined();
        expect(screen.getByText("Tag2")).toBeDefined();
      });
    });
    describe("Should render spot address info", () => {
      test("Country", () => {
        expect(screen.getByText(/Country/i)).toBeDefined();
      });
      test("City", () => {
        expect(screen.getByText(/City/i)).toBeDefined();
      });
      test("Street", () => {
        expect(screen.getByText("Street")).toBeDefined();
      });
    });
    test("Should render photos", () => {
      expect(screen.getAllByAltText("PhotoTitle1")).toBeDefined();
      expect(screen.getAllByAltText("PhotoTitle2")).toBeDefined();
    });
    describe("Should render spot action buttons", () => {
      test("navigate to spot", () => {
        expect(
          screen.getByTestId("navigate-to-spot-button-icon"),
        ).toBeDefined();
      });
      test("save spot", () => {
        expect(screen.getByTestId("save-spot-button-icon")).toBeDefined();
      });
      test("share spot", () => {
        expect(screen.getByTestId("share-spot-button-icon")).toBeDefined();
      });
      test("add photo", () => {
        expect(screen.getByTestId("add-photo-button-icon")).toBeDefined();
      });
    });
  });
});
