import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocalImage {
    id: string;
    file: File;
}

export type FormId = "post" | "comment" | "reply";

interface ForumMediaInitialState {
    forms: Record<FormId, { images: LocalImage[] }>;
}

const initialState: ForumMediaInitialState = {
    forms: {
        post: { images: [] },
        comment: { images: [] },
        reply: { images: [] },
    },
};

export const forumMediaSlice = createSlice({
    name: "forumMedia",
    initialState,
    reducers: {
        addImage: (
            state,
            action: PayloadAction<{ formId: FormId; image: LocalImage }>,
        ) => {
            const { formId, image } = action.payload;
            state.forms[formId].images.push(image);
        },

        removeImage: (
            state,
            action: PayloadAction<{ formId: FormId; id: string }>,
        ) => {
            const { formId, id } = action.payload;
            state.forms[formId].images = state.forms[formId].images.filter(
                (img) => img.id !== id,
            );
        },

        clearImages: (state, action: PayloadAction<FormId>) => {
            const formId = action.payload;
            state.forms[formId].images = [];
        },
    },
});

export const forumMediaAction = forumMediaSlice.actions;
