import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CurrentViewSpotParamsProps = {
    name: string;
    sorting: string;
    ratingFrom: number;
    swLng: number;
    swLat: number;
    neLng: number;
    neLat: number;
};

const initialState: CurrentViewSpotParamsProps = {
    name: "",
    sorting: "none",
    ratingFrom: 0.0,
    swLng: 0,
    swLat: 0,
    neLng: 0,
    neLat: 0,
};

export const currentViewSpotParamsSlice = createSlice({
    name: "currentViewSpotParams",
    initialState,
    reducers: {
        setParams(
            state,
            action: PayloadAction<Partial<CurrentViewSpotParamsProps>>,
        ) {
            state.name = action.payload.name ?? state.name;
            state.sorting = action.payload.sorting ?? state.sorting;
            state.ratingFrom = action.payload.ratingFrom ?? state.ratingFrom;
            state.swLng = action.payload.swLng ?? state.swLng;
            state.swLat = action.payload.swLat ?? state.swLat;
            state.neLng = action.payload.neLng ?? state.neLng;
            state.neLat = action.payload.neLat ?? state.neLat;
        },
    },
});

export const currentViewSpotParamsActions = currentViewSpotParamsSlice.actions;
