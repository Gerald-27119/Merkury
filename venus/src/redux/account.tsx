import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AccountSliceProps {
    isLogged: boolean;
    username: string;
    // profileImageUrl: string;
}

const initialState: AccountSliceProps = {
    isLogged: localStorage.getItem("is_logged_in") === "true",
    username: localStorage.getItem("username") || "",
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
            localStorage.removeItem("username");
            state.isLogged = false;
            state.username = "";
        },
        setUsername(state, action: PayloadAction<string>) {
            localStorage.setItem("username", action.payload);
            state.username = action.payload;
        },
    },
});

export const accountAction = accountSlice.actions;
