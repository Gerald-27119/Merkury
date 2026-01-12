import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import PostToEdit from "../model/interface/forum/post/postToEdit";

interface ForumModalInitialState {
    isOpen: boolean;
    mode: "create" | "edit";
    postToEdit?: PostToEdit | null;
}

const initialState: ForumModalInitialState = {
    isOpen: false,
    mode: "create",
    postToEdit: null,
};

export const forumModalSlice = createSlice({
    name: "forumModal",
    initialState,
    reducers: {
        openCreateModal(state) {
            state.isOpen = true;
            state.mode = "create";
            state.postToEdit = null;
        },
        openEditModal(state, action: PayloadAction<PostToEdit>) {
            state.isOpen = true;
            state.mode = "edit";
            state.postToEdit = action.payload;
        },
        closeModal(state) {
            state.isOpen = false;
            state.postToEdit = null;
        },
    },
});

export const forumModalAction = forumModalSlice.actions;
