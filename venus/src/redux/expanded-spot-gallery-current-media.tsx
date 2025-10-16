import { MediaType } from "../model/enum/mediaType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ExpandedSpotGalleryCurrentMediaProps = {
    url: string;
    mediaType: MediaType;
};

const initialState: ExpandedSpotGalleryCurrentMediaProps = {
    url: "",
    mediaType: MediaType.PHOTO,
};

export const expandedSpotGalleryCurrentMediaSlice = createSlice({
    name: "expandedSpotGalleryCurrentMedia",
    initialState,
    reducers: {
        setCurrentMedia(
            state,
            action: PayloadAction<ExpandedSpotGalleryCurrentMediaProps>,
        ) {
            const newCurrentMedia = action.payload;
            state.url = newCurrentMedia.url;
            state.mediaType = newCurrentMedia.mediaType;
        },
    },
});

export const expandedSpotGalleryCurrentMediaActions =
    expandedSpotGalleryCurrentMediaSlice.actions;
