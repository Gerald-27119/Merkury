import axios from "axios";
import { ChatDto, ChatPage } from "../model/interface/chat/chatInterfaces";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getChatListByPage(
    pageParam: number = 0,
    numberOfChatsPerPage = 20,
): Promise<ChatPage> {
    const items = (
        await axios.get<ChatDto[]>(`${BASE_URL}/chats/user-chats`, {
            withCredentials: true,
            params: { pageNumber: pageParam, numberOfChatsPerPage },
        })
    ).data;

    // TODO: move this somewhere else
    const nextPage =
        items.length === numberOfChatsPerPage ? pageParam + 1 : undefined;
    return { items, nextPage };
}

//TODO: reafactor method names etc
//TODO: work on loading skeletons, spinners, optimize rerenders, etc.
//TODO: add caching?
//TODO: add caching on frontend, to not refetch every time?
