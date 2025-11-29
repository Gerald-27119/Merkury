import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AddSpotCommentModalInfoProps = {
    showModal: boolean;
    spotName: string;
};

const initialState: AddSpotCommentModalInfoProps = {
    showModal: false,
    spotName: "",
};

export const addSpotCommentModalInfoSlice = createSlice({
    name: "addSpotCommentModalInfo",
    initialState,
    reducers: {
        openAddSpotCommentModal(state, action: PayloadAction<string>) {
            state.showModal = true;
            state.spotName = action.payload;
        },
        closeAddSpotCommentModal(state) {
            state.showModal = false;
            state.spotName = "";
        },
    },
});

export const addSpotCommentModalInfoActions =
    addSpotCommentModalInfoSlice.actions;
