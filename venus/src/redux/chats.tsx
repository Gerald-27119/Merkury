import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";
import {
    DetailedChatDto,
    SimpleChatDto,
} from "../model/interface/chat/chatInterfaces";
import { RootState } from "./store";

interface ChatDto {
    id: number;
    simpleChatDto: SimpleChatDto;
    detailedChatDto: DetailedChatDto;
}

interface ChatsState {
    nextPage: number | null;
    currentlySelectedChatId: number | null;
}

const chatsAdapter = createEntityAdapter<ChatDto>({});

const initialState = chatsAdapter.getInitialState<ChatsState>({
    nextPage: 1,
    currentlySelectedChatId: 1,
});

export const chatsSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        addSimpleChatDtos(state, action: PayloadAction<SimpleChatDto[]>) {
            const toUpsert: ChatDto[] = action.payload.map((simple) => ({
                id: simple.id,
                simpleChatDto: simple,
                detailedChatDto: {} as DetailedChatDto,
            }));
            chatsAdapter.upsertMany(state, toUpsert);
        },
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

//TODO: need to figure out a better way to handle current page for ChatList, same for Messages inside Chat
export const chatActions = chatsSlice.actions;

export const {
    selectAll: selectAllChats,
    selectById: selectChatById,
    selectIds: selectChatIds,
    selectEntities: selectChatEntities,
    selectTotal: selectChatTotal,
} = chatsAdapter.getSelectors<RootState>((state) => state.chats);

export default chatsSlice.reducer;
