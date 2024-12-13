import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  message: "",
  isOpen: false,
  error: false,
  success: false,
  info: false,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setError(state, action) {
      state.title = "Error";
      state.message = action.payload.message;
      state.isOpen = true;
      state.error = true;
    },
    setSuccess(state, action) {
      state.title = "Success";
      state.message = action.payload.message;
      state.isOpen = true;
      state.success = true;
    },
    setInfo(state, action) {
      state.title = "Info";
      state.message = action.payload.message;
      state.isOpen = true;
      state.info = true;
    },
    closeNotification(state) {
      state.title = "";
      state.message = "";
      state.isOpen = false;
      state.error = false;
      state.success = false;
    },
  },
});

export const notificationAction = notificationSlice.actions;
