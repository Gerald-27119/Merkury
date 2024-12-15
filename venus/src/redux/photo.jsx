import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expandPhoto: false,
};

export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    handleExpandPhoto(state) {
      state.expandPhoto = true;
    },
    handleMinimizePhoto(state) {
      state.expandPhoto = false;
    },
  },
});

export const photoAction = photoSlice.actions;
