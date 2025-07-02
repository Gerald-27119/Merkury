import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";
import {
    ChatMessageDto,
    DetailedChatDto,
    SimpleChatDto,
} from "../model/interface/chat/chatInterfaces";
import { RootState } from "./store";

export interface ChatDto {
    id: number;
    simpleChatDto: SimpleChatDto;
    detailedChatDto: DetailedChatDto;
}

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
            if (!chat.detailedChatDto.messages) {
                chat.detailedChatDto.messages = [];
            }
            chat.detailedChatDto.messages.push(message);
            chat.detailedChatDto.messages.sort(
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
