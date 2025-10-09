import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "./account";
import { notificationSlice } from "./notification";
import { photoSlice } from "./photo.jsx";
import { spotDetailsModalSlice } from "./spot-modal";
import { expandedSpotMediaGallerySlice } from "./expanded-spot-media-gallery";
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
import { expandedSpotGalleryMediaListSlice } from "./expanded-spot-gallery-media-list";

// TODO: Add persisting state to localStorage
const store = configureStore({
    reducer: {
        account: accountSlice.reducer,
        notification: notificationSlice.reducer,
        photo: photoSlice.reducer,
        spotDetails: spotDetailsModalSlice.reducer,
        searchedSpotsListModal: searchedSpotListModalSlice.reducer,
        expandedSpotMediaGallery: expandedSpotMediaGallerySlice.reducer,
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
        expandedSpotGalleryMediaList: expandedSpotGalleryMediaListSlice.reducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
