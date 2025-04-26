import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { DetailedChatDto, SimpleChatDto } from "../pages/chats/constants";
import { RootState } from "./store";

export interface ChatDto {
  id: number;
  simpleChatDto: SimpleChatDto;
  detailedChatDto: DetailedChatDto;
}

const chatsAdapter = createEntityAdapter<ChatDto>({});

const initialState = chatsAdapter.getInitialState();

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    /**
     * Dodaje lub aktualizuje wiele prostych czatów naraz.
     * Każdy SimpleChatDto mapujemy na pełne ChatDto,
     * wypełniając `detailedChatDto` pustym obiektem.
     */
    addSimpleChatDtos(state, action: PayloadAction<SimpleChatDto[]>) {
      const toUpsert: ChatDto[] = action.payload.map((simple) => ({
        id: simple.id,
        simpleChatDto: simple,
        detailedChatDto: {} as DetailedChatDto,
      }));
      chatsAdapter.upsertMany(state, toUpsert);
    },

    /**
     * Dodaje lub aktualizuje wiele szczegółowych czatów naraz.
     * Dla każdego DetailedChatDto zachowujemy istniejący simpleChatDto,
     * jeśli już był w stanie, lub wypełniamy pustym obiektem.
     */
    addDetailedChatDtos(state, action: PayloadAction<DetailedChatDto[]>) {
      const toUpsert: ChatDto[] = action.payload.map((detail) => ({
        id: detail.id,
        simpleChatDto: state.entities[detail.id]?.simpleChatDto!,
        detailedChatDto: detail,
      }));
      chatsAdapter.upsertMany(state, toUpsert);
    },
  },
});

export const { addSimpleChatDtos, addDetailedChatDtos } = chatsSlice.actions;

export const {
  selectAll: selectAllChats,
  selectById: selectChatById,
  selectIds: selectChatIds,
  selectEntities: selectChatEntities,
  selectTotal: selectChatTotal,
} = chatsAdapter.getSelectors<RootState>((state) => state.chats);

export default chatsSlice.reducer;
