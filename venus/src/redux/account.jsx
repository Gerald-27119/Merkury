import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged: localStorage.getItem("is_logged_in") === "true",
  username: "",
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setIsLogged(state, action) {
      localStorage.setItem("is_logged_in", true);
      state.isLogged = true;
      localStorage.setItem("username", action.payload.username);
      state.username = action.payload.username;
    },
    signOut(state) {
      localStorage.removeItem("is_logged_in");
      state.isLogged = false;
      localStorage.removeItem("username");
      state.username = null;
    },
  },
});

export const accountAction = accountSlice.actions;
