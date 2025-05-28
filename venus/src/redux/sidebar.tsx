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
  },
});

export const sidebarAction = sidebarSlice.actions;
