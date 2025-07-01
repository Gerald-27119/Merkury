import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    numberOfPhotos: 0,
    currentPhotoIndex: 0,
};

export const photoGallerySlice = createSlice({
    name: "photo-gallery",
    initialState,
    reducers: {
        setNextPhoto(state) {
            if (state.currentPhotoIndex < state.numberOfPhotos - 1) {
                state.currentPhotoIndex += 1;
            }
        },
        setPreviousPhoto(state) {
            if (state.currentPhotoIndex > 0) {
                state.currentPhotoIndex -= 1;
            }
        },
        setNumberOfPhotos(state, action) {
            state.numberOfPhotos = action.payload;
        },
    },
});

export const photoGalleryAction = photoGallerySlice.actions;
