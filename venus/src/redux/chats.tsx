import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";
import {
    ChatDto,
    ChatMessageDto,
} from "../model/interface/chat/chatInterfaces";
import { RootState } from "./store";

interface ChatsState {
    nextPage: number | null;
    selectedChatId: number;
}

const chatsAdapter = createEntityAdapter<ChatDto>({});

const initialState = chatsAdapter.getInitialState<ChatsState>({
    nextPage: 1,
    selectedChatId: 1,
});

export const chatsSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        addChatDtos(state, action: PayloadAction<ChatDto[]>) {
            chatsAdapter.upsertMany(state, action.payload);
        },
        setNextPage(state, action: PayloadAction<number | null>) {
            state.nextPage = action.payload;
        },
        setSelectedChatId(state, action: PayloadAction<number>) {
            state.selectedChatId = action.payload;
        },
        addMessage(
            state,
            action: PayloadAction<{ chatId: number; message: ChatMessageDto }>,
        ) {
            const { chatId, message } = action.payload;
            const chat = state.entities[chatId];
            if (!chat) {
                return;
            }
            if (!chat.messages) {
                chat.messages = [];
            }
            chat.messages.push(message);
            chat.messages.sort(
                (a, b) =>
                    new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
            );
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
