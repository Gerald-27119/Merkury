import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";
import SpotExpandedGalleryMediaDto from "../model/interface/spot/expanded-media-gallery/spotExpandedGalleryMediaDto";
import { RootState } from "./store";

export const expandedSpotGalleryMediaListAdapter =
    createEntityAdapter<SpotExpandedGalleryMediaDto>();

const initialState = expandedSpotGalleryMediaListAdapter.getInitialState();

export const expandedSpotGalleryMediaListSlice = createSlice({
    name: "expandedSpotGalleryMediaList",
    initialState,
    reducers: {
        upsertMediaList(
            state,
            action: PayloadAction<SpotExpandedGalleryMediaDto[]>,
        ) {
            expandedSpotGalleryMediaListAdapter.upsertMany(
                state,
                action.payload,
            );
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
