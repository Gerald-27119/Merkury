import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  minRating: 0,
  maxRating: 5,
};
export const spotFiltersSlice = createSlice({
  name: "spotFilters",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.name = action.payload.name || state.name;
      state.minRating = action.payload.minRating || state.minRating;
      state.maxRating = action.payload.maxRating || state.maxRating;
    },
  },
});

export const spotFiltersAction = spotFiltersSlice.actions;
