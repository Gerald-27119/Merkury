import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "./account.jsx";

const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
  },
});

export default store;
