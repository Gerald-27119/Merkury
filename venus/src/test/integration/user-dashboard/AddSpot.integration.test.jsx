import React from "react";
import { describe, test, beforeAll, beforeEach, vi, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { Provider as ReduxProvider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import { accountSlice } from "../../../redux/account.tsx";
import AddedSpot from "../../../pages/account/add-spot/AddedSpot.tsx";
import AddSpotModal from "../../../pages/account/add-spot/components/AddSpotModal.tsx";
import {
    getAllSpotsAddedByUser,
    fetchCoordinates,
} from "../../../http/user-dashboard";

vi.mock("../../../http/user-dashboard", () => ({
    getAllSpotsAddedByUser: vi.fn(),
    addSpot: vi.fn(),
    fetchCoordinates: vi.fn(),
}));

vi.mock("maplibre-gl", () => {
    const remove = vi.fn();
    const mockMap = vi.fn(() => ({ remove }));
    const mockMarker = vi.fn(() => ({
        setLngLat: vi.fn().mockReturnThis(),
        addTo: vi.fn(),
    }));

    return {
        __esModule: true,
        default: {
            Map: mockMap,
            Marker: mockMarker,
        },
    };
});

vi.mock("@vis.gl/react-maplibre", () => ({
    __esModule: true,
    Map: ({ children, onClick }) => (
        <div data-testid="mock-map" onClick={onClick}>
            {children}
        </div>
    ),
    Source: ({ children }) => <div data-testid="mock-source">{children}</div>,
    Layer: () => null,
}));

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });

const createTestStore = () =>
    configureStore({
        reducer: {
            account: accountSlice.reducer,
        },
        preloadedState: {
            account: { isLogged: true },
        },
    });

const renderAddedSpot = () => {
    const store = createTestStore();
    const queryClient = createTestQueryClient();

    return render(
        <ReduxProvider store={store}>
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <AddedSpot />
                </QueryClientProvider>
            </MemoryRouter>
        </ReduxProvider>,
    );
};

const renderAddSpotModal = (onClose = vi.fn()) => {
    const store = createTestStore();
    const queryClient = createTestQueryClient();

    const modalRoot = document.createElement("div");
    modalRoot.id = "modal";
    document.body.appendChild(modalRoot);

    render(
        <ReduxProvider store={store}>
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <AddSpotModal isOpen={true} onClose={onClose} />
                </QueryClientProvider>
            </MemoryRouter>
        </ReduxProvider>,
    );

    return { modalRoot, onClose };
};

let originalInnerWidth = global.innerWidth;

beforeAll(() => {
    class IntersectionObserverMock {
        constructor() {}
        observe() {}
        unobserve() {}
        disconnect() {}
    }

    global.IntersectionObserver = IntersectionObserverMock;
});

beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
    Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
    });
});

describe("AddedSpot – integration tests", () => {
    test("renders added spots list when API returns items", async () => {
        getAllSpotsAddedByUser.mockResolvedValueOnce({
            hasNext: false,
            items: [
                {
                    id: 1,
                    name: "Sample spot",
                    description: "Sample description",
                    firstPhotoUrl: "spot1.jpg",
                    country: "Poland",
                    city: "Gdańsk",
                    street: "Długa 1",
                    borderPoints: [{ x: 54.35, y: 18.65 }],
                },
            ],
        });

        const modalRoot = document.createElement("div");
        modalRoot.id = "modal";
        document.body.appendChild(modalRoot);

        renderAddedSpot();

        expect(await screen.findByText("Sample spot")).toBeInTheDocument();

        expect(screen.getByAltText("spot-image")).toHaveAttribute(
            "src",
            "spot1.jpg",
        );

        expect(screen.getByText("Location")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Description")).toBeInTheDocument();
        expect(screen.getByText("Address")).toBeInTheDocument();

        expect(screen.getByText("Sample description")).toBeInTheDocument();
        expect(screen.getByText("Poland, Gdańsk, Długa 1")).toBeInTheDocument();
    });

    test("shows empty state message when API returns no spots", async () => {
        getAllSpotsAddedByUser.mockResolvedValueOnce({
            hasNext: false,
            items: [],
        });

        const modalRoot = document.createElement("div");
        modalRoot.id = "modal";
        document.body.appendChild(modalRoot);

        renderAddedSpot();

        expect(
            await screen.findByText("You haven't added any spots yet."),
        ).toBeInTheDocument();
    });

    test("opens AddSpotModal when clicking 'Add spot' on desktop", async () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 1200,
        });

        getAllSpotsAddedByUser.mockResolvedValueOnce({
            hasNext: false,
            items: [],
        });

        const modalRoot = document.createElement("div");
        modalRoot.id = "modal";
        document.body.appendChild(modalRoot);

        renderAddedSpot();

        const addSpotButton = await screen.findByRole("button", {
            name: /add spot/i,
        });

        await addSpotButton.click();

        expect(
            await screen.findByText("Basic Information"),
        ).toBeInTheDocument();
    });

    test("does not open AddSpotModal on mobile (width < 900)", async () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 800,
        });

        getAllSpotsAddedByUser.mockResolvedValueOnce({
            hasNext: false,
            items: [],
        });

        const modalRoot = document.createElement("div");
        modalRoot.id = "modal";
        document.body.appendChild(modalRoot);

        renderAddedSpot();

        const addSpotButton = await screen.findByRole("button", {
            name: /add spot/i,
        });

        await addSpotButton.click();

        await waitFor(() => {
            expect(
                screen.queryByText("Basic Information"),
            ).not.toBeInTheDocument();
        });
    });
});

describe("AddSpotModal – integration tests", () => {
    test("renders core modal structure when open", () => {
        fetchCoordinates.mockResolvedValue({ x: 18.65, y: 54.35 });

        const { modalRoot } = renderAddSpotModal();

        expect(screen.getByText("Add spot")).toBeInTheDocument();

        expect(screen.getByText("Basic Information")).toBeInTheDocument();
        expect(screen.getByText("Address")).toBeInTheDocument();
        expect(screen.getByText("Upload Media")).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /close/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /add spot/i }),
        ).toBeInTheDocument();

        expect(
            modalRoot.querySelector("[data-testid='mock-map']"),
        ).toBeInTheDocument();
    });

    test("calls onClose when clicking close button", async () => {
        fetchCoordinates.mockResolvedValue({ x: 18.65, y: 54.35 });

        const onClose = vi.fn();
        renderAddSpotModal(onClose);

        const closeButton = screen.getByRole("button", {
            name: /close/i,
        });

        await closeButton.click();

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
