import { createSlice } from "@reduxjs/toolkit";

type SearchedSpotListModalProps = {
    showList: boolean;
};

const initialState: SearchedSpotListModalProps = {
    showList: false,
};

export const searchedSpotListModalSlice = createSlice({
    name: "searchedSpotsListModal",
    initialState,
    reducers: {
        handleOpenList(state) {
            state.showList = true;
        },
        handleCloseList(state) {
            state.showList = false;
        },
    },
});

export const searchedSpotListModalAction = searchedSpotListModalSlice.actions;
