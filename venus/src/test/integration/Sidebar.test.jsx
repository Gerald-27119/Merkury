import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "../../redux/account.jsx";
import userEvent from "@testing-library/user-event";
import Sidebar from "../../layout/sidebar/Sidebar.tsx";

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

describe("Sidebar theme toggle integration tests", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  test("should toggle from dark to light mode", async () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");

    renderSidebar();

    const changeModeButton = screen.getByLabelText("changeMode");
    expect(changeModeButton).toBeInTheDocument();

    await userEvent.click(changeModeButton);

    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  test("should toggle from light to dark mode", async () => {
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");

    renderSidebar();

    const changeModeButton = screen.getByLabelText("changeMode");
    expect(changeModeButton).toBeInTheDocument();

    await userEvent.click(changeModeButton);

    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
