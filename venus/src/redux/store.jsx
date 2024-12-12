import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "./account.jsx";
import { notificationSlice } from "./notification.jsx";

const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    notification: notificationSlice.reducer,
  },
});

export default store;
