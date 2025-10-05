import { createSlice } from "@reduxjs/toolkit";
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
    reducers: {},
});

export const expandedSpotMediaGalleryAction =
    expandedSpotMediaGallerySlice.actions;
