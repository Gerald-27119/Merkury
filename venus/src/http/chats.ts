import axios from "axios";
import type { ListedChatDto } from "../pages/chats/chatMockData";
import { DetailedChatDto } from "../pages/chats/constants";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getChatListByPage(
  userId: number,
  page = 0,
): Promise<ListedChatDto[]> {
  const response = await axios.get<ListedChatDto[]>(
    `${BASE_URL}/public/chats`,
    { params: { userId, page } },
  );
  return response.data;
}

export async function getDetailedChat(
  chatId: number,
  userId: number,
): Promise<DetailedChatDto> {
  const response = await axios.get<DetailedChatDto>(
    `${BASE_URL}/public/chats/${chatId}/${userId}`,
  );
  return response.data;
}
