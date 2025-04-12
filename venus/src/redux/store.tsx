import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "./account.jsx";
import { notificationSlice } from "./notification.jsx";
import { photoSlice } from "./photo.jsx";
import { spotDetailsModalSlice } from "./spot-modal.jsx";
import { photoGallerySlice } from "./photo-gallery.jsx";
import { spotFiltersSlice } from "./spot-filters.jsx";

const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    notification: notificationSlice.reducer,
    photo: photoSlice.reducer,
    spotDetails: spotDetailsModalSlice.reducer,
    photoGallery: photoGallerySlice.reducer,
    spotFilters: spotFiltersSlice.reducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
