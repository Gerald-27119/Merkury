import React from "react";
import { useQuery } from "@tanstack/react-query";
import ListedChat from "./ListedChat";
import type { ListedChatDto } from "../chatMockData";
import { getChatListByPage } from "../../../http/chats";

export default function ChatList() {
  const userId = 1;
  const page = 0;

  const {
    data: chats = [],
    isLoading,
    isError,
    error,
  } = useQuery<ListedChatDto[]>({
    queryKey: ["user-chat-list", userId, page],
    queryFn: () => getChatListByPage(userId, page),
  });

  if (isLoading) {
    return <div>Loading chats…</div>;
  }

  if (isError) {
    console.error(error);
    return <div>Failed to load chats</div>;
  }

  if (chats.length === 0) {
    return <p>Brak czatów</p>;
  }

  return (
    <>
      {chats.map((chat) => (
        <ListedChat key={chat.id} listedChatDto={chat} />
      ))}
    </>
  );
}
