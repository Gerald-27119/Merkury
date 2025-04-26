import React, { useRef, useEffect } from "react";
import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import ListedChat from "./ListedChat";
import { getChatListByPage } from "../../../http/chats";
import { addSimpleChatDtos, selectAllChats } from "../../../redux/chats";
import { ChatPage } from "../constants";

export default function ChatList() {
  const dispatch = useDispatch();
  const allChats = useSelector(selectAllChats);
  const userId = 1;
  const pageSize = 13;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,
    isSuccess,
  } = useInfiniteQuery<ChatPage, Error>({
    queryKey: ["user-chat-list", userId] as const,
    queryFn: ({
      pageParam = 0,
    }: QueryFunctionContext<["user-chat-list", number], number>) =>
      getChatListByPage(userId, pageParam, pageSize),
    getNextPageParam: (last) => last.nextPage,
    initialPageParam: 0,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const newItems = data.pages[data.pages.length - 1].items;
      dispatch(addSimpleChatDtos(newItems));
    }
  }, [isSuccess, data, dispatch]);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          obs.unobserve(entry.target);
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) return <div>Loading chats…</div>; //TODO: add skeleton
  if (isError) return <div>Failed to load chats</div>; //TODO: add error handling, notification

  return (
    <>
      {allChats.map((chat) => (
        <ListedChat key={chat.id} simpleChatDto={chat.simpleChatDto} />
      ))}
      <div ref={loadMoreRef} className="h-1" />
      {/*TODO: add nicer spinner*/}
      {isFetchingNextPage && <div>Loading more…</div>}
    </>
  );
}
