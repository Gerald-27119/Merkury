import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "./account";
import { notificationSlice } from "./notification";
import { photoSlice } from "./photo.jsx";
import { spotDetailsModalSlice } from "./spot-modal";
import { photoGallerySlice } from "./photo-gallery.jsx";
import { spotFiltersSlice } from "./spot-filters";
import { chatsSlice } from "./chats";
import { mapSlice } from "./map";
import { sidebarSlice } from "./sidebar";
import { socialSlice } from "./social";
import { spotCommentSlice } from "./spot-comments";
import { searchedSpotListModalSlice } from "./searched-spot-list-modal";
import { searchedSpotsSlice } from "./searched-spots";
import { currentViewSpotsSlice } from "./current-view-spots";
import { currentViewSpotsListModalSlice } from "./current-view-spots-list-modal";
import { currentViewSpotParamsSlice } from "./current-view-spot-params";
import { spotWeatherSlice } from "./spot-weather";
import { addSpotMediaModalSlice } from "./add-spot-media-modal";

// TODO: Add persisting state to localStorage
const store = configureStore({
    reducer: {
        account: accountSlice.reducer,
        notification: notificationSlice.reducer,
        photo: photoSlice.reducer,
        spotDetails: spotDetailsModalSlice.reducer,
        searchedSpotsListModal: searchedSpotListModalSlice.reducer,
        photoGallery: photoGallerySlice.reducer,
        spotFilters: spotFiltersSlice.reducer,
        chats: chatsSlice.reducer,
        map: mapSlice.reducer,
        sidebar: sidebarSlice.reducer,
        searchedSpots: searchedSpotsSlice.reducer,
        social: socialSlice.reducer,
        spotComments: spotCommentSlice.reducer,
        currentViewSpots: currentViewSpotsSlice.reducer,
        currentViewSpotsListModal: currentViewSpotsListModalSlice.reducer,
        currentViewSpotsParams: currentViewSpotParamsSlice.reducer,
        spotWeather: spotWeatherSlice.reducer,
        spotAddMediaModal: addSpotMediaModalSlice.reducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
