import { createSlice } from "@reduxjs/toolkit";

type CurrentViewSpotsListModalProps = {
    showList: boolean;
};

const initialState: CurrentViewSpotsListModalProps = {
    showList: false,
};

export const currentViewSpotsListModalSlice = createSlice({
    name: "currentViewSpotsListModal",
    initialState,
    reducers: {
        openCurrentViewSpotsListModal(state) {
            state.showList = true;
        },
        closeCurrentViewSpotsListModal(state) {
            state.showList = false;
        },
    },
});

export const currentViewSpotsListModalActions =
    currentViewSpotsListModalSlice.actions;
