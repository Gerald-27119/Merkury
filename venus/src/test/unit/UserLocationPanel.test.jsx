import { render } from "@testing-library/react";
import { screen } from "@testing-library/react";
import UserLocationPanel from "../../pages/map/components/UserLocationPanel.tsx";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { notificationSlice } from "../../redux/notification.jsx";

const renderUserLocationPanel = () => {
  const store = configureStore({
    reducer: {
      notification: notificationSlice.reducer,
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <UserLocationPanel />
      </MemoryRouter>
    </Provider>,
  );
};

vi.mock("@vis.gl/react-maplibre", () => ({
  Map: ({ children }) => <div>{children}</div>,
  useMap: vi.fn(),
}));
vi.mock("@vis.gl/react-maplibre", () => ({
  ...vi.importActual("@vis.gl/react-maplibre"),
  useMap: vi.fn().mockReturnValue({
    current: {
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
    },
  }),
}));

describe("UserLocationPanel unit tests", () => {
  beforeEach(() => {
    renderUserLocationPanel();
  });

  test("should user location panel", () => {
    expect(screen.getByTestId("user-location-btn")).toBeInTheDocument();
  });
});
