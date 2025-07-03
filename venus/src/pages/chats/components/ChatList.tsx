import React, { useRef, useEffect } from "react";
import {
    useInfiniteQuery,
    QueryFunctionContext,
    InfiniteData,
} from "@tanstack/react-query";
import { useSelector } from "react-redux";
import ListedChat from "./ListedChat";
import { getChatListByPage } from "../../../http/chats";
import {
    ChatPage,
    SimpleChatDto,
} from "../../../model/interface/chat/chatInterfaces";
import { selectAllChats, chatActions } from "../../../redux/chats";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import SkeletonListedChat from "./skeleton/SkeletonListedChat";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";

export default function ChatList() {
    const dispatch = useDispatchTyped();
    const allChats = useSelector(selectAllChats);
    // for development purposes
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
    } = useInfiniteQuery<
        ChatPage,
        Error,
        InfiniteData<ChatPage>,
        readonly ["user-chat-list", number]
    >({
        queryKey: ["user-chat-list", userId] as const,
        queryFn: ({
            pageParam = 0,
        }: QueryFunctionContext<readonly ["user-chat-list", number]>) =>
            getChatListByPage(userId, pageParam as number, pageSize),
        getNextPageParam: (last) => last.nextPage,
        initialPageParam: 0,
    });

    useEffect(() => {
        if (isSuccess && data) {
            const newItems: SimpleChatDto[] = (
                data.pages[data.pages.length - 1] as ChatPage
            ).items;
            dispatch(chatActions.addSimpleChatDtos(newItems));
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

    if (isLoading)
        return Array.from({ length: 15 }).map((_, index) => (
            <SkeletonListedChat key={index} />
        ));
    if (isError) return <div>Failed to load chats</div>; //TODO: add error handling, notification

    return (
        <>
            {allChats.map((chat) => (
                <ListedChat key={chat?.id} simpleChatDto={chat.simpleChatDto} />
            ))}
            <div ref={loadMoreRef} className="h-1" />
            {/*TODO: add nicer spinner*/}
            {isFetchingNextPage && (
                <LoadingSpinner borderTopClass="border-t-violetLight" />
            )}
        </>
    );
}
