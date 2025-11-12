import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ForumReportModalInitialState {
    isReportOpen: boolean;
    reportTarget: { type: "post" | "comment"; id: number } | null;
}

const initialState: ForumReportModalInitialState = {
    isReportOpen: false,
    reportTarget: null,
};

export const forumReportModalSlice = createSlice({
    name: "forumReportModal",
    initialState: initialState,
    reducers: {
        openReportModal: (
            state,
            action: PayloadAction<{ type: "post" | "comment"; id: number }>,
        ) => {
            state.isReportOpen = true;
            state.reportTarget = action.payload;
        },
        closeReportModal: (state) => {
            state.isReportOpen = false;
            state.reportTarget = null;
        },
    },
});

export const forumReportModalAction = forumReportModalSlice.actions;
