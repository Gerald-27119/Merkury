import SpotExpandedGalleryMediaDto from "../model/interface/spot/expanded-media-gallery/spotExpandedGalleryMediaDto";
import { MediaType } from "../model/enum/mediaType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SpotExpandedGalleryMediaDto = {
    id: 0,
    url: "",
    mediaType: MediaType.PHOTO,
    likesNumber: 0,
    publishDate: "",
    authorName: "",
    authorProfilePhotoUrl: "",
};

export const expandedSpotGalleryCurrentMediaSlice = createSlice({
    name: "expandedSpotGalleryCurrentMedia",
    initialState,
    reducers: {
        setCurrentMedia(
            state,
            action: PayloadAction<SpotExpandedGalleryMediaDto>,
        ) {
            const newCurrentMedia = action.payload;
            state.id = newCurrentMedia.id;
            state.url = newCurrentMedia.url;
            state.mediaType = newCurrentMedia.mediaType;
            state.likesNumber = newCurrentMedia.likesNumber;
            state.publishDate = newCurrentMedia.publishDate;
            state.authorName = newCurrentMedia.authorName;
            state.authorProfilePhotoUrl = newCurrentMedia.authorProfilePhotoUrl;
        },
    },
});

export const expandedSpotGalleryCurrentMediaActions =
    expandedSpotGalleryCurrentMediaSlice.actions;
