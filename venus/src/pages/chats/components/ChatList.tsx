import React, { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ListedChat from "./ListedChat";
import { getChatListByPage } from "../../../http/chats";
import {
    ChatDto,
    ChatPage,
} from "../../../model/interface/chat/chatInterfaces";
import SkeletonListedChat from "./skeleton/SkeletonListedChat";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import {
    chatActions,
    selectHasNewMap,
    selectAllChats,
} from "../../../redux/chats";

export default function ChatList() {
    const dispatch = useDispatchTyped();
    const selectedChatId = useSelectorTyped((s) => s.chats.selectedChatId);
    const hasNewMap = useSelectorTyped(selectHasNewMap);

    const chats = useSelectorTyped(selectAllChats);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError,
        isLoading,
    } = useInfiniteQuery<ChatPage>({
        queryKey: ["user-chat-list"],
        queryFn: ({ pageParam = 0 }) =>
            getChatListByPage(pageParam as number, 13),
        getNextPageParam: (last) => last.nextPage,
        initialPageParam: 0,
    });

    useEffect(() => {
        if (!data?.pages?.length) return;
        const lastPage = data.pages[data.pages.length - 1];
        if (!lastPage?.items?.length) return;

        const toRedux: ChatDto[] = lastPage.items.map((chatDto) => ({
            id: chatDto.id,
            name: chatDto.name,
            imgUrl: chatDto.imgUrl,
            participants: chatDto.participants ?? [],
            lastMessage: chatDto.lastMessage,
            messages: [],
            chatType: chatDto.chatType,
        }));

        dispatch(chatActions.upsertChats(toRedux));
    }, [data, dispatch]);

    const didSelectRef = useRef(false);
    useEffect(() => {
        if (didSelectRef.current) return;
        if (selectedChatId != null) {
            didSelectRef.current = true;
            return;
        }
        if (chats.length > 0) {
            dispatch(chatActions.setSelectedChatId(chats[0].id));
            didSelectRef.current = true;
        }
    }, [chats, selectedChatId, dispatch]);

    const loadMoreRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!loadMoreRef.current || !hasNextPage) return;
        const obs = new IntersectionObserver(
            ([entry], o) => {
                if (
                    entry.isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    o.unobserve(entry.target);
                    fetchNextPage();
                }
            },
            { rootMargin: "200px" },
        );
        obs.observe(loadMoreRef.current);
        return () => obs.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (isLoading && chats.length === 0) {
        return (
            <>
                {Array.from({ length: 15 }).map((_, i) => (
                    <SkeletonListedChat key={i} />
                ))}
            </>
        );
    }

    if (isError && chats.length === 0) return <div>Failed to load chats</div>;

    return (
        <>
            {chats.map((chat) => {
                const isSelected = chat.id === selectedChatId;
                const hasNew = !isSelected && hasNewMap[chat.id];
                return <ListedChat key={chat.id} chat={chat} hasNew={hasNew} />;
            })}
            <div ref={loadMoreRef} className="h-1" />
            {isFetchingNextPage && (
                <LoadingSpinner borderTopClass="border-t-violetLight" />
            )}
        </>
    );
}
