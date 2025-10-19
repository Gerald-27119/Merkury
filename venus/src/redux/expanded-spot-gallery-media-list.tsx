import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "./store";
import SpotExpandedGallerySidebarMediaDto from "../model/interface/spot/expanded-media-gallery/spotExpandedGallerySidebarMediaDto";

export const expandedSpotGalleryMediaListAdapter =
    createEntityAdapter<SpotExpandedGallerySidebarMediaDto>();

const initialState = expandedSpotGalleryMediaListAdapter.getInitialState();

export const expandedSpotGalleryMediaListSlice = createSlice({
    name: "expandedSpotGalleryMediaList",
    initialState,
    reducers: {
        upsertMediaList(
            state,
            action: PayloadAction<SpotExpandedGallerySidebarMediaDto[]>,
        ) {
            expandedSpotGalleryMediaListAdapter.upsertMany(
                state,
                action.payload,
            );
        },
        prependMediaList(
            state,
            action: PayloadAction<SpotExpandedGallerySidebarMediaDto[]>,
        ) {
            expandedSpotGalleryMediaListAdapter.upsertMany(
                state,
                action.payload,
            );
            const newIds = action.payload.map((item) => item.id);
            state.ids = [
                ...newIds,
                ...state.ids.filter((id) => !newIds.includes(id)),
            ];
        },
        clearMediaList(state) {
            expandedSpotGalleryMediaListAdapter.removeAll(state);
        },
    },
});

export const expandedSpotGalleryMediaListSelectors =
    expandedSpotGalleryMediaListAdapter.getSelectors<RootState>(
        (state) => state.expandedSpotGalleryMediaList,
    );

export const expandedSpotGalleryMediaListAction =
    expandedSpotGalleryMediaListSlice.actions;
