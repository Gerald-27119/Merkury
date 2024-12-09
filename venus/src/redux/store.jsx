import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "./account.jsx";
import { photoSlice } from "./photo.jsx";
import { spotDetailsModalSlice } from "./spot-modal.jsx";

const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    photo: photoSlice.reducer,
    spotDetails: spotDetailsModalSlice.reducer,
  },
});

export default store;
