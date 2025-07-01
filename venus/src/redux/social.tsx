import { createSlice } from "@reduxjs/toolkit";
import { SocialListType } from "../model/enum/account/social/socialListType";

interface SocialSliceProps {
    type: SocialListType;
}

const initialState: SocialSliceProps = {
    type: SocialListType.FRIENDS,
};

export const socialSlice = createSlice({
    name: "social",
    initialState,
    reducers: {
        setType(state, action) {
            state.type = action.payload;
        },
    },
});

export const socialAction = socialSlice.actions;
