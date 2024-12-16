import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModal: false,
  spot: null,
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
    setSpot(state, action) {
      state.spot = action.payload;
    },
  },
});

export const spotDetailsModalAction = spotDetailsModalSlice.actions;
