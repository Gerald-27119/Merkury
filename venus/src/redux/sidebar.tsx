import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";

type sidebarInitialState = {
  isOpen: boolean;
};

const initialState: sidebarInitialState = {
  isOpen: false,
};

/**
 * Thunk to close the sidebar on smaller screens.
 *
 * This action will close the sidebar **only if the current viewport width is less than 1280px**.
 *
 * @example
 * dispatch(closeSidebar());
 */
export const closeSidebar = () => (dispatch: AppDispatch) => {
  if (window.innerWidth < 1280) {
    dispatch(sidebarAction.setIsSidebarOpen(false));
  }
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    /**
     * Sets the sidebar open/closed explicitly.
     * @param state Current sidebar state.
     * @param action Payload: `true` to open, `false` to close.
     */
    setIsSidebarOpen(state, action) {
      state.isOpen = action.payload;
    },
    /**
     * Toggles the current open/close state of the sidebar.
     * No arguments needed.
     */
    toggleSidebar(state) {
      state.isOpen = !state.isOpen;
    },
  },
});

export const sidebarAction = sidebarSlice.actions;
