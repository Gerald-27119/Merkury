import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  message: "",
  isOpen: false,
  error: false,
  success: false,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    openNotification(state, action) {
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.isOpen = true;
      state.error = action.payload.error;
      state.success = action.payload.success;
    },
    closeNotification(state) {
      state.title = "";
      state.message = "";
      state.isOpen = false;
      state.error = false;
      state.success = false;
    },
    signOutNotification(state) {
      state.title = "Success";
      state.message = "You have been correctly logged out";
      state.isOpen = true;
      state.success = true;
    },
  },
});

export const notificationAction = notificationSlice.actions;
