// ChatList.tsx
import React, { useRef, useEffect, useMemo } from "react";
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
import { chatActions, selectHasNewMap } from "../../../redux/chats";

export default function ChatList() {
    const dispatch = useDispatchTyped();
    const selectedChatId = useSelectorTyped((s) => s.chats.selectedChatId);
    const hasNewMap = useSelectorTyped(selectHasNewMap);

    const numberOfChatsPerPage = 13;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError,
        isLoading,
        isSuccess,
    } = useInfiniteQuery<ChatPage>({
        queryKey: ["user-chat-list"],
        queryFn: ({ pageParam = 0 }) =>
            getChatListByPage(pageParam as number, numberOfChatsPerPage),
        getNextPageParam: (last) => last.nextPage,
        initialPageParam: 0,
    });

    // merge + dedupe tylko do renderu
    const chats: ChatDto[] = useMemo(() => {
        if (!isSuccess || !data) return [];
        const map = new Map<number, ChatDto>();
        for (const page of data.pages) {
            for (const item of page.items) map.set(item.id, item);
        }
        return Array.from(map.values());
    }, [data, isSuccess]);

    // upsert do Reduxa tylko nowej strony (żeby mieć lastMessage + hasNew)
    const pagesLen = data?.pages.length ?? 0;
    useEffect(() => {
        if (!pagesLen) return;
        const lastPage = data!.pages[pagesLen - 1];
        if (!lastPage?.items?.length) return;

        const toRedux = lastPage.items.map<ChatDto>((c) => ({
            id: c.id,
            name: c.name,
            imgUrl: c.imgUrl,
            participants: c.participants,
            lastMessage: c.lastMessage,
            messages: [],
        }));
        dispatch(chatActions.upsertChats(toRedux));
    }, [pagesLen, dispatch, data]);

    // ustaw pierwszy czat jako selected (raz)
    const didSelectRef = useRef(false);
    const firstChatId = data?.pages?.[0]?.items?.[0]?.id;
    useEffect(() => {
        if (didSelectRef.current) return;
        if (selectedChatId != null) {
            didSelectRef.current = true;
            return;
        }
        if (typeof firstChatId === "number") {
            dispatch(chatActions.setSelectedChatId(firstChatId));
            didSelectRef.current = true;
        }
    }, [firstChatId, selectedChatId, dispatch]);

    // sentinel do paginacji
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

    if (isLoading)
        return (
            <>
                {Array.from({ length: 15 }).map((_, i) => (
                    <SkeletonListedChat key={i} />
                ))}
            </>
        );
    if (isError) return <div>Failed to load chats</div>;

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
