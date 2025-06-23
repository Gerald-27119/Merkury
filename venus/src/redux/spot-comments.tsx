import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import SpotCommentDto from "../model/interface/spot/comment/spotCommentDto";
import { RootState } from "./store";

export const spotCommentAdapter = createEntityAdapter<SpotCommentDto>({
  sortComparer: (a: SpotCommentDto, b: SpotCommentDto) =>
    a.id.toString().localeCompare(b.id.toString()),
});

const initialState = spotCommentAdapter.getInitialState();

export const spotCommentSlice = createSlice({
  name: "spotComments",
  initialState,
  reducers: {
    upsertComments: (state, action: PayloadAction<SpotCommentDto[]>) => {
      spotCommentAdapter.upsertMany(state, action.payload);
    },
    clearComments: (state) => {
      spotCommentAdapter.removeAll(state);
    },
  },
});

export const spotCommentSelectors = spotCommentAdapter.getSelectors<RootState>(
  (state) => state.spotComments,
);

export const spotCommentSliceAction = spotCommentSlice.actions;
