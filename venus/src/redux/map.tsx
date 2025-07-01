import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type mapInitialState = {
    zoomLevel: number;
};

const initialState: mapInitialState = {
    zoomLevel: 15,
};

export const mapSlice = createSlice({
    name: "map",
    initialState,
    reducers: {
        setZoomLevel(state, action: PayloadAction<number | null>): void {
            state.zoomLevel = action.payload ?? state.zoomLevel;
        },
    },
});

export const mapAction = mapSlice.actions;
