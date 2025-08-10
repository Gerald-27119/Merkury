import {
    ChatDto,
    ChatMessageDto,
} from "../../../../model/interface/chat/chatInterfaces";
import ChatMessage from "./ChatMessage";
import { format } from "date-fns";
import {
    InfiniteData,
    useInfiniteQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { getMessagesForChat } from "../../../../http/chats";
import { useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { selectLastMessageForChat } from "../../../../redux/chats";

type MessagesSlice = {
    messages: ChatMessageDto[];
    hasNextSlice: boolean;
    sliceNumber: number;
};

interface ChatMessagingWindowProps {
    chatDto: ChatDto;
}

export default function ChatMessagingWindow({
    chatDto,
}: ChatMessagingWindowProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const lastAppliedIdRef = useRef<number | null>(null); // ⬅️ liczba lub null

    // Historia wiadomości (paginacja)
    const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
        useInfiniteQuery({
            queryKey: ["messages", chatDto?.id],
            enabled: !!chatDto?.id,
            queryFn: ({ pageParam = 0 }) =>
                getMessagesForChat(chatDto!.id, pageParam),
            initialPageParam: 0,
            getNextPageParam: (lastPage) =>
                lastPage.hasNextSlice ? lastPage.sliceNumber + 1 : undefined,
        });

    // sentinel do ładowania starszych
    const { ref: topSentinelRef, inView: topInView } = useInView({
        root: containerRef.current ?? undefined,
        rootMargin: "100px 0px 0px 0px",
        threshold: 0,
    });

    useEffect(() => {
        if (topInView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [topInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // spłaszczone wiadomości do renderu
    const messages = useMemo<ChatMessageDto[]>(() => {
        if (!data) return [];
        return data.pages.flatMap((p) => p.messages ?? []);
    }, [data]);

    // ostatnia wiadomość z Reduxa -> dopięcie/podmiana w cache
    const lastIncoming = useSelectorTyped<ChatMessageDto | undefined>(
        useMemo(
            () => selectLastMessageForChat(chatDto?.id ?? -1),
            [chatDto?.id],
        ),
    );

    useEffect(() => {
        if (!chatDto?.id || !lastIncoming) return;
        if (lastIncoming.id === lastAppliedIdRef.current) return;

        queryClient.setQueryData<InfiniteData<MessagesSlice>>(
            ["messages", chatDto.id],
            (old) => {
                if (!old) return old;

                // 1) jeśli już mamy tę wiadomość po ID -> nic nie rób
                const hasSameId = old.pages.some((p) =>
                    (p.messages ?? []).some((m) => m.id === lastIncoming.id),
                );
                if (hasSameId) {
                    lastAppliedIdRef.current = lastIncoming.id;
                    return old;
                }

                // 2) podmiana optymistycznej (id<0 lub flaga optimistic)
                let replaced = false;
                const pagesReplaced = old.pages.map((p) => {
                    if (replaced) return p;
                    const msgs = (p.messages ?? []).map((m) => {
                        const isOptimistic =
                            (m as any).optimistic === true ||
                            (typeof m.id === "number" && m.id < 0);

                        // porównujemy autora po NAME (opt. ma sender.id = -1)
                        const sameAuthorName =
                            (m as any).sender?.name ===
                            (lastIncoming as any).sender?.name;

                        const sameContent =
                            (m as any).content ===
                            (lastIncoming as any).content;

                        // tolerancja czasu 5s
                        const timeClose =
                            Math.abs(
                                new Date(m.sentAt).getTime() -
                                    new Date(lastIncoming.sentAt).getTime(),
                            ) < 5000;

                        if (
                            !replaced &&
                            isOptimistic &&
                            sameAuthorName &&
                            sameContent &&
                            timeClose
                        ) {
                            replaced = true;
                            return lastIncoming; // temp -> real
                        }
                        return m;
                    });
                    return { ...p, messages: msgs };
                });

                if (replaced) {
                    lastAppliedIdRef.current = lastIncoming.id;
                    return { ...old, pages: pagesReplaced };
                }

                // 3) brak temp -> dopnij na początek pierwszej strony (flex-col-reverse)
                const first = old.pages[0] ?? {
                    messages: [],
                    hasNextSlice: true,
                    sliceNumber: 0,
                };
                const newFirst = {
                    ...first,
                    messages: [lastIncoming, ...(first.messages ?? [])],
                };
                lastAppliedIdRef.current = lastIncoming.id;
                return { ...old, pages: [newFirst, ...old.pages.slice(1)] };
            },
        );
    }, [chatDto?.id, lastIncoming, queryClient]);

    // UI
    if (messages.length === 0) {
        return (
            <p className="mt-auto px-4 py-1 font-light">
                It's the beginning of the conversation with{" "}
                <span className="font-semibold">{chatDto?.name}</span>.
            </p>
        );
    }

    return (
        <div
            ref={containerRef}
            className="scrollbar-track-violetDark scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin bg-violetDark/20 flex h-full flex-col-reverse overflow-y-scroll py-1"
        >
            {messages.map((message, idx) => {
                const thisDate = new Date(message.sentAt).toDateString();
                const prevMessage = messages[idx + 1];
                const prevDate =
                    prevMessage && new Date(prevMessage.sentAt).toDateString();

                const shouldGroupMessagesByTime =
                    checkIfShouldGroupMessagesByTime(message, prevMessage);

                return (
                    <div
                        key={message.id}
                        className="hover:bg-violetLight/40 pl-2"
                    >
                        {thisDate !== prevDate && (
                            <div className="my-2 flex w-full items-center">
                                <hr className="flex-grow border-gray-500" />
                                <span className="px-2 text-xs text-gray-300">
                                    {format(new Date(message.sentAt), "PPP")}
                                </span>
                                <hr className="flex-grow border-gray-500" />
                            </div>
                        )}
                        <ChatMessage
                            message={message}
                            shouldGroupMessagesByTime={
                                shouldGroupMessagesByTime
                            }
                        />
                    </div>
                );
            })}

            <div ref={topSentinelRef} aria-hidden className="h-0 w-full" />

            {hasNextPage && isFetchingNextPage && (
                <div className="py-2 text-center text-xs text-gray-400">
                    Loading older…
                </div>
            )}
        </div>
    );
}

function checkIfShouldGroupMessagesByTime(
    message: ChatMessageDto,
    prevMessage?: ChatMessageDto,
): boolean {
    if (!prevMessage) return false;

    const current = new Date(message.sentAt);
    const previous = new Date(prevMessage.sentAt);

    if (current.toDateString() !== previous.toDateString()) return false;

    // ⬇️ porównuj po name, żeby optymistyczne (sender.id = -1) grupowały się z realnymi
    if ((message as any).sender?.name !== (prevMessage as any).sender?.name)
        return false;

    const diffMs = Math.abs(current.getTime() - previous.getTime());
    const diffMinutes = diffMs / 1000 / 60;
    return diffMinutes < 2;
}
