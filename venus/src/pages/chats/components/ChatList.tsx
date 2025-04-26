import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import ListedChat from "./ListedChat";
import { getChatListByPage } from "../../../http/chats";
import { SimpleChatDto } from "../constants";
import { addSimpleChatDtos, selectAllChats } from "../../../redux/chats";

export default function ChatList() {
  const dispatch = useDispatch();
  const allChats = useSelector(selectAllChats);
  const userId = 1;
  const page = 0;
  const numberOfChatsPerPage = 20;

  const {
    data: chats,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<SimpleChatDto[]>({
    queryKey: ["user-chat-list", userId, page],
    queryFn: () => getChatListByPage(userId, page),
  });

  useEffect(() => {
    if (isSuccess && chats) {
      dispatch(addSimpleChatDtos(chats));
    }
  }, [isSuccess, chats, dispatch]);

  if (isLoading) {
    return <div>Loading chats…</div>;
  }

  if (isError) {
    return <div>Failed to load chats</div>;
  }

  if (!allChats || allChats.length === 0) {
    return <p>Brak czatów</p>;
  }

  return (
    <>
      {allChats.map((chat) => (
        <ListedChat key={chat.id} simpleChatDto={chat.simpleChatDto} />
      ))}
    </>
  );
}
