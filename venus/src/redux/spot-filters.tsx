import { createSlice } from "@reduxjs/toolkit";

type SpotFiltersProps = {
  name: string;
  sorting: string;
};

const initialState: SpotFiltersProps = {
  name: "",
  sorting: "none",
};
export const spotFiltersSlice = createSlice({
  name: "spotFilters",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.name = action.payload.name;
      state.sorting = action.payload.sorting ?? "none";
    },
  },
});

export const spotFiltersAction = spotFiltersSlice.actions;
