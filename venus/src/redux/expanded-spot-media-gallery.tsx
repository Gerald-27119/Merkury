import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MediaType } from "../model/enum/mediaType";
import { SpotExpandedGallerySortingType } from "../model/enum/spot/spotExpandedGallerySortingType";

type ExpandedSpotMediaGallerySliceProps = {
    mediaId: number;
    mediaType: MediaType;
    sorting: SpotExpandedGallerySortingType;
    mediaPagePosition: number;
};

const initialState: ExpandedSpotMediaGallerySliceProps = {
    mediaId: 0,
    mediaType: MediaType.PHOTO,
    sorting: SpotExpandedGallerySortingType.NEWEST,
    mediaPagePosition: 0,
};

export const expandedSpotMediaGallerySlice = createSlice({
    name: "expanded-spot-media-gallery",
    initialState,
    reducers: {
        setExpandedGallerySorting(
            state,
            action: PayloadAction<{ sorting: SpotExpandedGallerySortingType }>,
        ) {
            state.sorting = action.payload.sorting;
        },
        setExpandedGalleryMediaType(
            state,
            action: PayloadAction<{ mediaType: MediaType }>,
        ) {
            state.mediaType = action.payload.mediaType;
        },
        setExpandedGalleryMediaId(
            state,
            action: PayloadAction<{ mediaId: number }>,
        ) {
            state.mediaId = action.payload.mediaId;
        },
        setExpandedGalleryMediaPagePosition(
            state,
            action: PayloadAction<{ mediaPagePosition: number }>,
        ) {
            state.mediaPagePosition = action.payload.mediaPagePosition;
        },
    },
});

export const expandedSpotMediaGalleryAction =
    expandedSpotMediaGallerySlice.actions;
