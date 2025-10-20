import axios from "axios";
import {
    ChatDto,
    ChatMessagesPageDto,
    ChatPage,
    UpdatedGroupChatDto,
} from "../model/interface/chat/chatInterfaces";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getChatListByPage(
    pageParam = 0,
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

export async function getMessagesForChat(
    chatId: number,
    pageParam = 0,
): Promise<ChatMessagesPageDto> {
    return (
        await axios.get<ChatMessagesPageDto>(
            `${BASE_URL}/chats/${chatId}/messages`,
            {
                withCredentials: true,
                params: {
                    pageParam,
                    numberOfMessagesPerPage: 20,
                },
            },
        )
    ).data;
}

export async function getOrCreatePrivateChat(
    chatId: number | null,
    receiverUsername: string,
): Promise<ChatDto> {
    const params: {
        receiverUsername: string;
        chatId?: number;
    } = {
        receiverUsername,
        ...(chatId != null && { chatId }),
    };

    const { data } = await axios.post<ChatDto>(
        `${BASE_URL}/chats/get-or-create-private-chat`,
        {},
        { withCredentials: true, params },
    );
    return data;
}

export async function sendFiles(
    chatId: number | null,
    files: File[],
): Promise<void> {
    const formData = new FormData();

    for (const file of files) {
        formData.append("media", file, file.name);
    }

    await axios.post<void>(`${BASE_URL}/chats/${chatId}/send-files`, formData, {
        withCredentials: true,
    });
}

export async function createGroupChat(usernames: string[]): Promise<ChatDto> {
    const body = { usernames };
    const { data } = await axios.post<ChatDto>(
        `${BASE_URL}/chats/create/group`,
        body,
        { withCredentials: true },
    );
    return data;
}

export type UpdateChatPayload = {
    name?: string;
    image?: File;
};

export async function updateChatDetails(
    chatId: number,
    payload: UpdateChatPayload,
): Promise<UpdatedGroupChatDto> {
    const form = new FormData();
    if (payload.name !== undefined) form.append("name", payload.name);
    if (payload.image) form.append("image", payload.image, payload.image.name);

    const { data } = await axios.patch<UpdatedGroupChatDto>(
        `${BASE_URL}/chats/${chatId}`,
        form,
        { withCredentials: true },
    );
    return data;
}
