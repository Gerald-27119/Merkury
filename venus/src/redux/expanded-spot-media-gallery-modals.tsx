import { createSlice } from "@reduxjs/toolkit";

type ExpandedSpotMediaGalleryModalsSliceProps = {
    showExpandedGallerySidebar: boolean;
    showExpandedGallery: boolean;
};

const initialState: ExpandedSpotMediaGalleryModalsSliceProps = {
    showExpandedGallery: false,
    showExpandedGallerySidebar: false,
};

export const expandedSpotMediaGalleryModalsSlice = createSlice({
    name: "expandedSpotMediaGalleryModals",
    initialState,
    reducers: {
        openModals(state) {
            state.showExpandedGallery = true;
            state.showExpandedGallerySidebar = true;
        },
        closeModals(state) {
            state.showExpandedGallery = false;
            state.showExpandedGallerySidebar = false;
        },
        openExpandedGalleySidebar(state) {
            state.showExpandedGallerySidebar = true;
        },
        closeExpandedGallerySidebar(state) {
            state.showExpandedGallerySidebar = false;
        },
        toggleExpandedGallerySidebar(state) {
            state.showExpandedGallerySidebar =
                !state.showExpandedGallerySidebar;
        },
    },
});

export const expandedSpotMediaGalleryModalsActions =
    expandedSpotMediaGalleryModalsSlice.actions;
