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

function memberKey(m: any) {
    return m?.id ?? m?.username ?? JSON.stringify(m);
}

function mergeMembers(prev?: any[], incoming?: any[]) {
    if (!prev && !incoming) return undefined;
    if (!prev) return incoming;
    if (!incoming) return prev;
    const map = new Map<string, any>();
    for (const m of [...prev, ...incoming]) map.set(memberKey(m), m);
    return Array.from(map.values());
}

function mergeChat(
    prev: ChatEntity | undefined,
    incoming: ChatDto,
): ChatEntity {
    const merged: any = { ...(prev ?? {}), ...incoming };
    merged.hasNew = (prev as any)?.hasNew ?? false;

    const prevMembers =
        (prev as any)?.members ??
        (prev as any)?.participants ??
        (prev as any)?.users;

    const incomingMembers =
        (incoming as any)?.members ??
        (incoming as any)?.participants ??
        (incoming as any)?.users;

    const unified = mergeMembers(prevMembers, incomingMembers);
    if (unified) {
        if ("members" in merged || "members" in (incoming as any)) {
            merged.members = unified;
        } else if (
            "participants" in merged ||
            "participants" in (incoming as any)
        ) {
            merged.participants = unified;
        } else if ("users" in merged || "users" in (incoming as any)) {
            merged.users = unified;
        }
    }
    return merged as ChatEntity;
}

export const chatsSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        toggleShowSideBar(state) {
            state.showSideBar = !state.showSideBar;
        },
        clearUsersToAddToChat(state) {
            state.usersToAddToChat = [];
        },
        addUserToAddToChat(state, action: PayloadAction<string>) {
            const u = action.payload;
            if (!state.usersToAddToChat.includes(u)) {
                state.usersToAddToChat.push(u);
            }
        },
        removeUserToAddToChat(state, action: PayloadAction<string>) {
            state.usersToAddToChat = state.usersToAddToChat.filter(
                (x) => x !== action.payload,
            );
        },
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
            const mergedItems: ChatEntity[] = action.payload.map((incoming) => {
                const prev = state.entities[incoming.id] as
                    | ChatEntity
                    | undefined;
                return mergeChat(prev, incoming);
            });
            chatsAdapter.upsertMany(state, mergedItems);
        },
        replaceChat(state, action: PayloadAction<ChatDto>) {
            const incoming = action.payload;
            const prev = state.entities[incoming.id] as ChatEntity | undefined;
            const entity: ChatEntity = {
                ...incoming,
                hasNew: prev?.hasNew ?? false,
            };
            chatsAdapter.upsertOne(state, entity);
        },
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
