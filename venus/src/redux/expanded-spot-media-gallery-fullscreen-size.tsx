import { createSlice } from "@reduxjs/toolkit";

type ExpandedSpotMediaGalleryFullscreenSizeSliceProps = {
    isFullscreenSize: boolean;
};

const initialState: ExpandedSpotMediaGalleryFullscreenSizeSliceProps = {
    isFullscreenSize: false,
};

export const expandedSpotMediaGalleryFullscreenSizeSlice = createSlice({
    name: "expandedSpotMediaGalleryFullscreenSize",
    initialState,
    reducers: {
        setFullScreen(state) {
            state.isFullscreenSize = true;
        },
        setNormalSize(state) {
            state.isFullscreenSize = false;
        },
    },
});

export const expandedSpotMediaGalleryFullscreenSizeActions =
    expandedSpotMediaGalleryFullscreenSizeSlice.actions;
