import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MediaType } from "../model/enum/mediaType";
import { SpotExpandedGallerySortingType } from "../model/enum/spot/spotExpandedGallerySortingType";

type ExpandedSpotMediaGallerySliceProps = {
    mediaId: number;
    mediaType: MediaType;
    sorting: SpotExpandedGallerySortingType;
};

const initialState: ExpandedSpotMediaGallerySliceProps = {
    mediaId: 0,
    mediaType: MediaType.PHOTO,
    sorting: SpotExpandedGallerySortingType.NEWEST,
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
    },
});

export const expandedSpotMediaGalleryAction =
    expandedSpotMediaGallerySlice.actions;
