import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { format } from "date-fns";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessagesForChat } from "../../../../http/chats";
import ChatMessage from "./ChatMessage";
import {
    ChatDto,
    ChatMessageDto,
} from "../../../../model/interface/chat/chatInterfaces";

interface ChatMessagingWindowProps {
    chatDto: ChatDto;
}

const bySentAtAsc = (a: ChatMessageDto, b: ChatMessageDto) =>
    +new Date(a.sentAt) - +new Date(b.sentAt);

function dedupeById(list: ChatMessageDto[]): ChatMessageDto[] {
    const map = new Map<string, ChatMessageDto>();
    for (const m of list) map.set(m.id, m);
    return Array.from(map.values());
}

function checkIfShouldGroupMessagesByTime(
    message: ChatMessageDto,
    prev?: ChatMessageDto,
) {
    if (!prev) return false;
    const a = new Date(message.sentAt),
        b = new Date(prev.sentAt);
    if (a.toDateString() !== b.toDateString()) return false;
    if (message.sender.id !== prev.sender.id) return false;
    return Math.abs(+a - +b) / 60000 < 2;
}

export default function ChatMessagingWindow({
    chatDto,
}: ChatMessagingWindowProps) {
    const parentRef = useRef<HTMLDivElement>(null);
    const didInitialScrollRef = useRef(false);
    const loadingPrevRef = useRef(false);

    // 100% wysokości rodzica — ale odejmujemy padding kontenera
    const [contentViewportH, setContentViewportH] = useState(0);
    useLayoutEffect(() => {
        const el = parentRef.current;
        if (!el) return;

        const compute = () => {
            const cs = getComputedStyle(el);
            const paddingY =
                parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
            // clientHeight zawiera padding, więc odejmujemy go, by dostać faktyczny obszar na treść
            setContentViewportH(el.clientHeight - paddingY);
        };

        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(el);
        window.addEventListener("resize", compute);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", compute);
        };
    }, []);

    // lokalny stan wiadomości
    const [messages, setMessages] = useState<ChatMessageDto[]>(() =>
        dedupeById((chatDto?.messages ?? []).slice()).sort(bySentAtAsc),
    );

    useEffect(() => {
        setMessages(
            dedupeById((chatDto?.messages ?? []).slice()).sort(bySentAtAsc),
        );
        didInitialScrollRef.current = false;
    }, [chatDto?.id]);

    // pobieranie starszych
    const { data, fetchNextPage, isFetchingNextPage, isSuccess, hasNextPage } =
        useInfiniteQuery({
            queryKey: ["messages", chatDto?.id],
            queryFn: ({ pageParam = 1 }) =>
                getMessagesForChat(chatDto?.id, pageParam),
            initialPageParam: 1,
            getNextPageParam: (lastPage) =>
                lastPage.hasNextSlice ? lastPage.sliceNumber + 1 : undefined,
        });

    useEffect(() => {
        if (!isSuccess || !data) return;
        const fetched = data.pages.flatMap((p) => p.messages);
        if (fetched.length === 0) return;
        setMessages((prev) =>
            dedupeById([...prev, ...fetched]).sort(bySentAtAsc),
        );
    }, [isSuccess, data]);

    // virtualizer
    const virtualizer = useVirtualizer({
        count: messages.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 72,
        overscan: 8,
        getItemKey: (i) => messages[i]?.id ?? i,
    });

    const items = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    // „doklejenie do dołu” z uwzględnieniem paddingu
    const bottomOffset = Math.max(0, contentViewportH - totalSize);
    const contentHeight = totalSize + bottomOffset; // realny layout

    // start: przewiń na dół tylko jeśli jest co przewijać
    useLayoutEffect(() => {
        if (!didInitialScrollRef.current && messages.length > 0) {
            requestAnimationFrame(() => {
                if (totalSize > contentViewportH) {
                    virtualizer.scrollToIndex(messages.length - 1, {
                        align: "end",
                    });
                }
                didInitialScrollRef.current = true;
            });
        }
    }, [messages.length, virtualizer, totalSize, contentViewportH]);

    // dociąganie starszych u góry z zachowaniem pozycji
    useEffect(() => {
        const el = parentRef.current;
        if (!el) return;
        const first = items[0];
        if (!first) return;

        const hasScrollbar = el.scrollHeight > el.clientHeight;
        if (
            hasScrollbar &&
            first.index === 0 &&
            first.start <= 0 &&
            hasNextPage &&
            !isFetchingNextPage &&
            !loadingPrevRef.current
        ) {
            loadingPrevRef.current = true;
            const prevScrollBottom = el.scrollHeight - el.scrollTop;

            fetchNextPage().finally(() => {
                requestAnimationFrame(() => {
                    el.scrollTop = el.scrollHeight - prevScrollBottom;
                    loadingPrevRef.current = false;
                });
            });
        }
    }, [items, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div
            ref={parentRef}
            className="bg-violetDark/20 scrollbar-thin scrollbar-thumb-violetLight scrollbar-track-violetDark"
            style={{
                contain: "strict",
                height: "100%",
                minHeight: 0,
                overflowY: "auto",
                paddingTop: 4, // zamiast tailwind, żeby było jasne co odejmujemy
                paddingBottom: 4,
            }}
        >
            <div
                style={{
                    height: contentHeight,
                    position: "relative",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: bottomOffset, // offset w layout
                        left: 0,
                        right: 0,
                        transform: `translateY(${items[0]?.start ?? 0}px)`, // tylko wirtualny start
                    }}
                >
                    {items.map((v) => {
                        const msg = messages[v.index];
                        const prev = messages[v.index - 1];

                        const thisDate = new Date(msg.sentAt).toDateString();
                        const prevDate =
                            prev && new Date(prev.sentAt).toDateString();

                        const shouldGroup = checkIfShouldGroupMessagesByTime(
                            msg,
                            prev,
                        );

                        return (
                            <div
                                key={msg.id}
                                ref={virtualizer.measureElement}
                                className="pl-2"
                                style={{ paddingTop: 4, paddingBottom: 4 }} // używamy paddingu, NIE marginów
                            >
                                {thisDate !== prevDate && (
                                    <div
                                        className="flex w-full items-center"
                                        style={{
                                            paddingTop: 8,
                                            paddingBottom: 8,
                                        }}
                                    >
                                        <hr className="flex-grow border-gray-500" />
                                        <span className="px-2 text-xs text-gray-300">
                                            {format(
                                                new Date(msg.sentAt),
                                                "PPP",
                                            )}
                                        </span>
                                        <hr className="flex-grow border-gray-500" />
                                    </div>
                                )}
                                <ChatMessage
                                    message={msg}
                                    shouldGroupMessagesByTime={shouldGroup}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
