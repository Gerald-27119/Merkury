import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocalImage {
    id: string;
    file: File;
}

interface ForumMediaInitialState {
    images: LocalImage[];
}

const initialState: ForumMediaInitialState = {
    images: [],
};

export const forumMediaSlice = createSlice({
    name: "forumMedia",
    initialState,
    reducers: {
        addImage: (state, action: PayloadAction<LocalImage>) => {
            state.images.push(action.payload);
        },
        removeImage: (state, action: PayloadAction<string>) => {
            state.images = state.images.filter(
                (img) => img.id !== action.payload,
            );
        },
        clearImages: (state) => {
            state.images = [];
        },
    },
});

export const forumMediaAction = forumMediaSlice.actions;
