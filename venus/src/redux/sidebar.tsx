import { createSlice } from "@reduxjs/toolkit";

type sidebarInitialState = {
  isOpen: boolean;
};

const initialState: sidebarInitialState = {
  isOpen: false,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setIsSidebarOpen(state, action) {
      state.isOpen = action.payload;
    },
    closeSidebar(state) {
      if (window.innerWidth < 1280) {
        state.isOpen = false;
      }
    },
    toggleSidebar(state) {
      state.isOpen = !state.isOpen;
    },
  },
});

export const sidebarAction = sidebarSlice.actions;
