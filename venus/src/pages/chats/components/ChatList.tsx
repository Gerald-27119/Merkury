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
import { chatActions } from "../../../redux/chats";

export default function ChatList() {
    const dispatch = useDispatchTyped();
    const selectedChatId = useSelectorTyped((s) => s.chats.selectedChatId);

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

    // 🔻 lokalny merge + dedupe po id (render)
    const chats: ChatDto[] = useMemo(() => {
        if (!isSuccess || !data) return [];
        const map = new Map<number, ChatDto>();
        for (const page of data.pages) {
            for (const item of page.items) {
                map.set(item.id, item);
            }
        }
        return Array.from(map.values());
    }, [data, isSuccess]);

    // --- efekt 1: upsert do Reduxa TYLKO gdy przybyła nowa strona ---
    const pagesLen = data?.pages.length ?? 0;

    useEffect(() => {
        if (!pagesLen) return;
        const lastPage = data!.pages[pagesLen - 1];
        if (!lastPage?.items?.length) return;

        // odchudź rekordy do Reduxa: messages []
        const toRedux = lastPage.items.map<ChatDto>((c) => ({
            id: c.id,
            name: c.name,
            imgUrl: c.imgUrl,
            participants: c.participants, // jeśli niepotrzebne, możesz podać []
            lastMessage: c.lastMessage,
            messages: [], // 👈 brak historii w Reduxie
        }));

        dispatch(chatActions.upsertChats(toRedux));
    }, [pagesLen, dispatch, data]);

    // --- efekt 2: ustaw pierwszy czat jako selected (tylko raz) ---
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
            didSelectRef.current = true; // zabezpiecza też przed podwójnym wywołaniem w StrictMode
        }
    }, [firstChatId, selectedChatId, dispatch]);

    // sentinel do ładowania kolejnej strony
    const loadMoreRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!loadMoreRef.current || !hasNextPage) return;

        const observer = new IntersectionObserver(
            ([entry], obs) => {
                if (
                    entry.isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    obs.unobserve(entry.target);
                    fetchNextPage();
                }
            },
            { rootMargin: "200px" },
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (isLoading)
        return (
            <>
                {Array.from({ length: 15 }).map((_, index) => (
                    <SkeletonListedChat key={index} />
                ))}
            </>
        );

    if (isError) return <div>Failed to load chats</div>;

    return (
        <>
            {chats.map((chat) => (
                <ListedChat key={chat.id} chat={chat} />
            ))}
            <div ref={loadMoreRef} className="h-1" />
            {isFetchingNextPage && (
                <LoadingSpinner borderTopClass="border-t-violetLight" />
            )}
        </>
    );
}
