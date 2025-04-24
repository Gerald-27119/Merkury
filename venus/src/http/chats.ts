import axios from "axios";
import type { ListedChatDto } from "../pages/chats/chatMockData";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

// GET /public/chats?userId={userId}&page={page}
export async function getChatListByPage(
  userId: number,
  page = 0,
): Promise<ListedChatDto[]> {
  const response = await axios.get<ListedChatDto[]>(
    `${BASE_URL}/public/chats`,
    { params: { userId, page } },
  );
  return response.data; // <- return the raw array
}
//
// // (Similarly for the other two)
// export async function getDetailedChat(
//   chatId: number,
//   userId: number,
// ): Promise<DetailedChatDto> {
//   const response = await axios.get<DetailedChatDto>(
//     `${BASE_URL}/public/chats/${chatId}/${userId}`,
//   );
//   return response.data;
// }
//
// export async function getChatMessagesByPage(
//   chatId: number,
//   page = 0,
// ): Promise<ChatMessageDto[]> {
//   const response = await axios.get<ChatMessageDto[]>(
//     `${BASE_URL}/public/chats/${chatId}/messages`,
//     { params: { page } },
//   );
//   return response.data;
// }
