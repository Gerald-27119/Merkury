import {
    createEntityAdapter,
    createSlice,
    createSelector,
    PayloadAction,
} from "@reduxjs/toolkit";
import {
    ChatDto,
    ChatMessageDto,
    UpdatedGroupChat,
    UpdatedGroupChatDto,
} from "../model/interface/chat/chatInterfaces";
import { RootState } from "./store";

type ChatsExtra = {
    selectedChatId: number | null;
    usersToAddToChat: string[];
    showSideBar: boolean;
};
type ChatEntity = ChatDto & { hasNew: boolean };

const timeOf = (m?: ChatMessageDto) => {
    if (!m?.sentAt) return 0;
    const t = Date.parse(m.sentAt);
    return Number.isFinite(t) ? t : 0;
};

const chatsAdapter = createEntityAdapter<ChatEntity>({
    sortComparer: (a, b) => timeOf(b.lastMessage) - timeOf(a.lastMessage),
});

const initialState = chatsAdapter.getInitialState<ChatsExtra>({
    selectedChatId: null,
    usersToAddToChat: [],
    showSideBar: false,
});

export const chatsSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        toggleShowSideBar(state) {
            state.showSideBar = !state.showSideBar;
        },

        /* --- Selekcja użytkowników do dodania do czatu --- */
        clearUsersToAddToChat(state) {
            state.usersToAddToChat = [];
        },
        setUsersToAddToChat(state, action: PayloadAction<string[]>) {
            // pełne nadpisanie – przydatne, gdy chcesz zsynchronizować ze źródłem
            // lub „wyczyścić i wkleić” wielu naraz
            const uniq = Array.from(new Set(action.payload));
            state.usersToAddToChat = uniq;
        },
        addUserToAddToChat(state, action: PayloadAction<string>) {
            const username = action.payload;
            // de-dupe
            if (!state.usersToAddToChat.includes(username)) {
                state.usersToAddToChat.push(username);
            }
        },
        removeUserToAddToChat(state, action: PayloadAction<string>) {
            state.usersToAddToChat = state.usersToAddToChat.filter(
                (u) => u !== action.payload,
            );
        },

        /* --- Aktualizacje listy czatów --- */
        updateChat(state, action: PayloadAction<UpdatedGroupChat>) {
            const { chatId, newName, newImgUrl } = action.payload;
            const changes: Partial<ChatEntity> = {};
            if (typeof newName === "string") {
                const n = newName.trim();
                if (n.length > 0 && n.toLowerCase() !== "null") {
                    changes.name = n;
                }
            }
            if (newImgUrl !== undefined) changes.imgUrl = newImgUrl;

            if (Object.keys(changes).length > 0) {
                chatsAdapter.updateOne(state, { id: chatId, changes });
            }
        },
        upsertChats(state, action: PayloadAction<ChatDto[]>) {
            const items: ChatEntity[] = action.payload.map((c) => {
                const prev = state.entities[c.id] as ChatEntity | undefined;
                return { ...c, hasNew: prev?.hasNew ?? false };
            });
            chatsAdapter.upsertMany(state, items);
        },

        /* --- Selekcja i statusy --- */
        setSelectedChatId(state, action: PayloadAction<number | null>) {
            state.selectedChatId = action.payload;
        },
        setLastMessage(
            state,
            action: PayloadAction<{ chatId: number; message: ChatMessageDto }>,
        ) {
            const { chatId, message } = action.payload;
            chatsAdapter.updateOne(state, {
                id: chatId,
                changes: { lastMessage: message },
            });
        },
        markNew(state, action: PayloadAction<number>) {
            const chat = state.entities[action.payload];
            if (chat) chat.hasNew = true;
        },
        clearNew(state, action: PayloadAction<number>) {
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
            map[Number(k)] = (v as ChatEntity).hasNew;
        }
        return map;
    },
);

export const selectIsChatPresent = (state: RootState, chatId: number) =>
    Boolean(state.chats.entities[chatId]);

export default chatsSlice.reducer;
