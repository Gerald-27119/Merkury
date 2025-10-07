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

type ChatsExtra = { selectedChatId: number | null; usersToAddToChat: string[] };
type ChatEntity = ChatDto & { hasNew: boolean };
const chatsAdapter = createEntityAdapter<ChatEntity>({});
const initialState = chatsAdapter.getInitialState<ChatsExtra>({
    selectedChatId: null,
    usersToAddToChat: [],
});

export const chatsSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        clearUsersToAddToChat: (state) => {
            state.usersToAddToChat = [];
        },
        addUserToAddToChat(state, action: PayloadAction<string>) {
            if (state.usersToAddToChat.length >= 6) return;
            const clearedUsersToAddToChat = state.usersToAddToChat.filter(
                (username) => username !== action.payload,
            );
            state.usersToAddToChat = [
                ...clearedUsersToAddToChat,
                action.payload,
            ];
        },
        removeUserToAddToChat(state, action: PayloadAction<string>) {
            state.usersToAddToChat = state.usersToAddToChat.filter(
                (username) => username !== action.payload,
            );
        },
        upsertChats: (state, action: PayloadAction<ChatDto[]>) => {
            const items: ChatEntity[] = action.payload.map((c) => {
                const prev = state.entities[c.id] as ChatEntity | undefined;
                return { ...c, hasNew: prev?.hasNew ?? false };
            });
            chatsAdapter.upsertMany(state, items);
        },
        setSelectedChatId: (state, action: PayloadAction<number | null>) => {
            state.selectedChatId = action.payload;
        },
        setLastMessage: (
            state,
            action: PayloadAction<{ chatId: number; message: ChatMessageDto }>,
        ) => {
            const { chatId, message } = action.payload;
            const chat = state.entities[chatId];
            if (chat) chat.lastMessage = message;
        },
        markNew: (state, action: PayloadAction<number>) => {
            const chat = state.entities[action.payload];
            if (chat) chat.hasNew = true;
        },
        clearNew: (state, action: PayloadAction<number>) => {
            const chat = state.entities[action.payload];
            if (chat) chat.hasNew = false;
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
                (state.chats.entities[chatId] as ChatEntity | undefined)
                    ?.lastMessage,
        ],
        (m) => m,
    );

export const selectHasNewMap = createSelector(
    selectChatEntities,
    (entities) => {
        const map: Record<number, boolean> = {};
        for (const [k, v] of Object.entries(entities)) {
            if (!v) continue;
            map[Number(k)] = v.hasNew;
        }
        return map;
    },
);

export const selectIsChatPresent = (state: RootState, chatId: number) =>
    Boolean(state.chats.entities[chatId]);

export default chatsSlice.reducer;
