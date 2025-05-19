import { createSlice } from "@reduxjs/toolkit";

interface AccountSliceProps {
  isLogged: boolean;
}

const initialState: AccountSliceProps = {
  isLogged: localStorage.getItem("is_logged_in") === "true",
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setIsLogged(state) {
      localStorage.setItem("is_logged_in", "true");
      state.isLogged = true;
    },
    signOut(state) {
      localStorage.removeItem("is_logged_in");
      state.isLogged = false;
    },
  },
});

export const accountAction = accountSlice.actions;
