import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import SpotComment from "../model/interface/spot/comment/spotComment";
import { RootState } from "./store";

export const spotCommentAdapter = createEntityAdapter<SpotComment>({
  sortComparer: (a: SpotComment, b: SpotComment) =>
    a.id.toString().localeCompare(b.id.toString()),
});

const initialState = spotCommentAdapter.getInitialState();

export const spotCommentSlice = createSlice({
  name: "spotComments",
  initialState,
  reducers: {
    upsertComments: (state, action: PayloadAction<SpotComment[]>) => {
      spotCommentAdapter.upsertMany(state, action.payload);
    },
  },
});

export const spotCommentSelectors = spotCommentAdapter.getSelectors<RootState>(
  (state) => state.spotComments,
);

export const spotCommentSliceAction = spotCommentSlice.actions;
