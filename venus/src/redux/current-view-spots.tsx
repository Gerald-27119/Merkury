import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";
import SearchSpotDto from "../model/interface/spot/search-spot/searchSpotDto";
import { RootState } from "./store";

export const currentViewSpotsAdapter = createEntityAdapter<SearchSpotDto>();

const initialState = currentViewSpotsAdapter.getInitialState();

export const currentViewSpotsSlice = createSlice({
    name: "currentViewSpots",
    initialState,
    reducers: {
        upsertCurrentViewSpots(state, action: PayloadAction<SearchSpotDto[]>) {
            currentViewSpotsAdapter.upsertMany(state, action.payload);
        },
        clearCurrentViewSpots(state) {
            currentViewSpotsAdapter.removeAll(state);
        },
    },
});

export const currentViewSpotsSelectors =
    currentViewSpotsAdapter.getSelectors<RootState>(
        (state) => state.currentViewSpots,
    );

export const currentViewSpotsActions = currentViewSpotsSlice.actions;
