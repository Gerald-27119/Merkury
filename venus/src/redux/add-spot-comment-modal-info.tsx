import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AddSpotCommentModalInfoProps = {
    showAddSpotCommentModal: boolean;
    spotName: string;
};

const initialState: AddSpotCommentModalInfoProps = {
    showAddSpotCommentModal: false,
    spotName: "",
};

export const addSpotCommentModalInfoSlice = createSlice({
    name: "addSpotCommentModalInfo",
    initialState,
    reducers: {
        openAddSpotCommentModal(state, action: PayloadAction<string>) {
            state.showAddSpotCommentModal = true;
            state.spotName = action.payload;
        },
        closeAddSpotCommentModal(state) {
            state.showAddSpotCommentModal = false;
            state.spotName = "";
        },
    },
});

export const addSpotCommentModalInfoActions =
    addSpotCommentModalInfoSlice.actions;
