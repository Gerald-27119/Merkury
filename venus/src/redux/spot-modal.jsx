import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModal: false,
  spotId: null,
};

export const spotDetailsModalSlice = createSlice({
  name: "spotDetails",
  initialState,
  reducers: {
    handleShowModal(state) {
      state.showModal = true;
    },
    handleCloseModal(state) {
      state.showModal = false;
    },
    setSpotId(state, action) {
      state.spotId = action.payload;
    },
  },
});

export const spotDetailsModalAction = spotDetailsModalSlice.actions;
