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
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { chatActions, selectLastMessageForChat } from "../../../../redux/chats";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";

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
    const lastAppliedIdRef = useRef<number | null>(null);
    const dispatch = useDispatchTyped();

    useEffect(() => {
        lastAppliedIdRef.current = null;
    }, [chatDto?.id]);

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

    const [scrollRoot, setScrollRoot] = useState<Element | null>(null);
    useEffect(() => {
        setScrollRoot(containerRef.current);
    }, []);

    const { ref: topSentinelRef, inView: topInView } = useInView({
        root: scrollRoot ?? undefined,
        rootMargin: "100px 0px 0px 0px",
        threshold: 0,
    });

    useEffect(() => {
        if (topInView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [topInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const messages = useMemo<ChatMessageDto[]>(() => {
        if (!data) return [];
        return data.pages.flatMap((p) => p.messages ?? []);
    }, [data]);

    const lastIncoming = useSelectorTyped<ChatMessageDto | undefined>(
        useMemo(
            () => selectLastMessageForChat(chatDto?.id ?? -1),
            [chatDto?.id],
        ),
    );

    useEffect(() => {
        if (chatDto?.id) {
            dispatch(chatActions.clearNew(chatDto.id));
        }
    }, [chatDto?.id, dispatch]);

    useEffect(() => {
        if (!chatDto?.id || !lastIncoming) return;

        if (String(lastIncoming.chatId) !== String(chatDto.id)) return;

        if (lastIncoming.id === lastAppliedIdRef.current) return;

        queryClient.setQueryData<InfiniteData<MessagesSlice>>(
            ["messages", lastIncoming.chatId],
            (old) => {
                if (!old) return old;

                const hasSameId = old.pages.some((p) =>
                    (p.messages ?? []).some((m) => m.id === lastIncoming.id),
                );
                if (hasSameId) {
                    lastAppliedIdRef.current = lastIncoming.id;
                    return old;
                }

                let replaced = false;
                const pagesReplaced = old.pages.map((p) => {
                    if (replaced) return p;
                    const msgs = (p.messages ?? []).map((m) => {
                        const isOptimistic =
                            (m as any).optimistic === true ||
                            (typeof m.id === "number" && m.id < 0);

                        const sameAuthorName =
                            (m as any).sender?.name ===
                            (lastIncoming as any).sender?.name;
                        const sameContent =
                            (m as any).content ===
                            (lastIncoming as any).content;
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
                            return lastIncoming;
                        }
                        return m;
                    });
                    return { ...p, messages: msgs };
                });

                if (replaced) {
                    lastAppliedIdRef.current = lastIncoming.id;
                    return { ...old, pages: pagesReplaced };
                }

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
            className="dark:scrollbar-track-violetDark scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin dark:bg-violetDark/20 flex h-full flex-col-reverse overflow-y-scroll bg-gray-50 py-1"
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
                        key={`${chatDto.id}:${message.id}`}
                        className="hover:bg-violetLight/10 pl-2"
                    >
                        {thisDate !== prevDate && (
                            <div className="my-2 flex w-full items-center">
                                <hr className="flex-grow border-gray-500" />
                                <span className="px-2 text-xs dark:text-gray-300">
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
                <div className="py-2 text-center text-xs dark:text-gray-400">
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

    if ((message as any).sender?.name !== (prevMessage as any).sender?.name)
        return false;

    const diffMs = Math.abs(current.getTime() - previous.getTime());
    const diffMinutes = diffMs / 1000 / 60;
    return diffMinutes < 2;
}
