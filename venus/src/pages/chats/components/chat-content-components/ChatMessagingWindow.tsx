import {
    ChatDto,
    ChatMessageDto,
} from "../../../../model/interface/chat/chatInterfaces";
import ChatMessage from "./ChatMessage";
import { format } from "date-fns";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessagesForChat } from "../../../../http/chats";
import { useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface ChatMessagingWindowProps {
    chatDto: ChatDto;
}

export default function ChatMessagingWindow({
    chatDto,
}: ChatMessagingWindowProps) {
    // HOOKI — zawsze na top-level
    const containerRef = useRef<HTMLDivElement>(null);

    const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
        useInfiniteQuery({
            queryKey: ["messages", chatDto?.id],
            enabled: !!chatDto?.id,
            queryFn: ({ pageParam = 1 }) =>
                getMessagesForChat(chatDto!.id, pageParam),
            initialPageParam: 1,
            getNextPageParam: (lastPage) =>
                lastPage.hasNextSlice ? lastPage.sliceNumber + 1 : undefined,
        });

    // sentinel – obserwujemy wejście w widok względem NASZEGO scrollowalnego kontenera
    const { ref: topSentinelRef, inView: topInView } = useInView({
        root: containerRef.current ?? undefined,
        rootMargin: "100px 0px 0px 0px",
        threshold: 0,
    });

    // gdy sentinel w widoku -> dociągnij następną stronę (gdy jest i nie trwa fetch)
    useEffect(() => {
        if (topInView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [topInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // WIDOKI STANÓW — po hookach
    // if (status === "pending") return <p>Loading…</p>;
    // if (status === "error") return <p>Failed to load.</p>;

    const messages = useMemo<ChatMessageDto[]>(() => {
        if (!data) return [];
        return data.pages.flatMap((p) => p.messages ?? []);
    }, [data]);

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
            {/* sentinel na górze — gdy wejdzie w widok, leci fetchNextPage() */}

            {messages.map((message, idx) => {
                const thisDate = new Date(message.sentAt).toDateString();
                // poprzednia wiadomość w oryginalnej kolejności (nie reverse)
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
    if (message.sender.id !== prevMessage.sender.id) return false;

    const diffMs = Math.abs(current.getTime() - previous.getTime());
    const diffMinutes = diffMs / 1000 / 60;

    return diffMinutes < 2;
}
