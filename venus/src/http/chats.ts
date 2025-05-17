import axios from "axios";
import {
    ChatPage,
    DetailedChatDto,
    SimpleChatDto,
} from "../model/interface/chat/chatInterfaces";
import { sleep } from "../utils/universal";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getChatListByPage(
    userId: number,
    pageParam = 0,
    numberOfChatsPerPage = 20,
): Promise<ChatPage> {
    // await sleep(3000);
    const items = (
        await axios.get<SimpleChatDto[]>(`${BASE_URL}/public/chats`, {
            params: { userId, pageParam, numberOfChatsPerPage },
        })
    ).data;
    // TODO: move this somewhere else
    const nextPage =
        items.length === numberOfChatsPerPage ? pageParam + 1 : undefined;
    return { items, nextPage };
}

export async function getDetailedChat(
    chatId: number,
    userId: number,
): Promise<DetailedChatDto> {
    // await sleep(3000);
    return (
        await axios.get<DetailedChatDto>(`${BASE_URL}/public/chats/${chatId}`, {
            params: { userId },
        })
    ).data;
}
