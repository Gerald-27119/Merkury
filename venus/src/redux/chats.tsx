import {
    createEntityAdapter,
    createSlice,
    createSelector,
    PayloadAction,
} from "@reduxjs/toolkit";
import {
    ChatDto,
    ChatMessageDto,
} from "../model/interface/chat/chatInterfaces";
import { RootState } from "./store";

const chatsAdapter = createEntityAdapter<ChatDto>({});

type ChatsExtra = { selectedChatId: number | null };
const initialState = chatsAdapter.getInitialState<ChatsExtra>({
    selectedChatId: null,
});

export const chatsSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        upsertChats: (state, action: PayloadAction<ChatDto[]>) => {
            chatsAdapter.upsertMany(state, action.payload);
        },
        setSelectedChatId: (state, action: PayloadAction<number | null>) => {
            state.selectedChatId = action.payload;
        },
        setLastMessage: (
            state,
            action: PayloadAction<{ chatId: number; message: ChatMessageDto }>,
        ) => {
            const { chatId, message } = action.payload;
            const chat = state.entities[chatId] as any;
            if (chat) chat.lastMessage = message;
        },
        incrementUnread: (state, action: PayloadAction<number>) => {
            const chat = state.entities[action.payload] as any;
            if (chat) chat.unreadCount = (chat.unreadCount ?? 0) + 1;
        },
        markRead: (state, action: PayloadAction<number>) => {
            const chat = state.entities[action.payload] as any;
            if (chat) chat.unreadCount = 0;
        },
    },
});

export const chatActions = chatsSlice.actions;

export const {
    selectAll: selectAllChats,
    selectById: selectChatById,
    selectIds: selectChatIds,
    selectEntities: selectChatEntities,
} = chatsAdapter.getSelectors<RootState>((s) => s.chats);

export const selectLastMessageForChat = (chatId: number) =>
    createSelector(
        [
            (state: RootState) =>
                (state.chats.entities[chatId] as any)?.lastMessage as
                    | ChatMessageDto
                    | undefined,
        ],
        (m) => m,
    );

export default chatsSlice.reducer;
