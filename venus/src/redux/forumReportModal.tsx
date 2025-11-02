import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ForumState {
    isReportOpen: boolean;
    reportContentId: number | null;
}

const initialState: ForumState = {
    isReportOpen: false,
    reportContentId: null,
};

export const forumReportModalSlice = createSlice({
    name: "forumReportModal",
    initialState: initialState,
    reducers: {
        openReportModal: (state, action: PayloadAction<number>) => {
            state.isReportOpen = true;
            state.reportContentId = action.payload;
        },
        closeReportModal: (state) => {
            state.isReportOpen = false;
            state.reportContentId = null;
        },
    },
});

export const forumReportModalAction = forumReportModalSlice.actions;
