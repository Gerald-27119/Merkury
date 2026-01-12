import { render } from "@testing-library/react";
import { screen } from "@testing-library/react";
import ZoomControlPanel from "../../pages/map/components/zoom-control/ZoomControlPanel.tsx";

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

describe("ZoomControlPanel unit tests", () => {
    beforeEach(() => {
        render(<ZoomControlPanel />);
    });

    test("should render zoom panel", () => {
        expect(screen.getByTestId("zoom-panel")).toBeInTheDocument();
    });
    test("should render zoom-in button", () => {
        expect(screen.getByTestId("zoom-in-btn")).toBeInTheDocument();
    });
    test("should render zoom-out button", () => {
        expect(screen.getByTestId("zoom-out-btn")).toBeInTheDocument();
    });
});
