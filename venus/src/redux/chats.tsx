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

interface ChatsState {
  nextPage: number | null;
}

const chatsAdapter = createEntityAdapter<ChatDto>({});

const initialState = chatsAdapter.getInitialState<ChatsState>({
  nextPage: 1,
});

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
    setNextPage(state, action: PayloadAction<number | null>) {
      state.nextPage = action.payload;
    },
  },
});

export const { addSimpleChatDtos, addDetailedChatDtos, setNextPage } =
  chatsSlice.actions;

export const {
  selectAll: selectAllChats,
  selectById: selectChatById,
  selectIds: selectChatIds,
  selectEntities: selectChatEntities,
  selectTotal: selectChatTotal,
} = chatsAdapter.getSelectors<RootState>((state) => state.chats);

export default chatsSlice.reducer;
