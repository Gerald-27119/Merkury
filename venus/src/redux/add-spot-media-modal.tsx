import {createSlice} from "@reduxjs/toolkit";

type AddSpotMediaModalProps = {
    showAddMediaModal: boolean
}

const initialState: AddSpotMediaModalProps = {
    showAddMediaModal: false
}

export const addSpotMediaModalSlice = createSlice({
    name: "addSpotMediaModal",
    initialState,
    reducers: {
        openAddSpotMediaModal(state) {
            state.showAddMediaModal = true
        },
        closeAddSpotMediaModal(state) {
            state.showAddMediaModal = false
        }
    }
})

export const addSpotMediaModalActions = addSpotMediaModalSlice.actions