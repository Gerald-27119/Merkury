import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import SearchSpotDto from "../model/interface/spot/searchSpotDto";
import { RootState } from "./store";

export const searchedSpotsAdapter = createEntityAdapter<SearchSpotDto>();

const initialState = searchedSpotsAdapter.getInitialState();

export const searchedSpotsSlice = createSlice({
  name: "searchedSpots",
  initialState,
  reducers: {
    upsertSearchedSpots: (state, action: PayloadAction<SearchSpotDto[]>) => {
      searchedSpotsAdapter.upsertMany(state, action.payload);
    },
    clearSearchedSpots: (state) => {
      searchedSpotsAdapter.removeAll(state);
    },
  },
});

export const searchedSpotsSelectors =
  searchedSpotsAdapter.getSelectors<RootState>((state) => state.searchedSpots);

export const searchedSpotsSliceActions = searchedSpotsSlice.actions;
