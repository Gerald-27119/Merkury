import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type spotModalInitialState = {
    showModal: boolean;
    spotId: number | null;
};

const initialState: spotModalInitialState = {
    showModal: false,
    spotId: null,
};

export const spotDetailsModalSlice = createSlice({
    name: "spotDetails",
    initialState,
    reducers: {
        handleShowModal(state) {
            state.showModal = true;
        },
        handleCloseModal(state) {
            state.showModal = false;
        },
        setSpotId(state, action: PayloadAction<number>): void {
            state.spotId = action.payload;
        },
    },
});

export const spotDetailsModalAction = spotDetailsModalSlice.actions;
