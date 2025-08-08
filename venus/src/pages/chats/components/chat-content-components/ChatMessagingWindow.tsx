import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { format } from "date-fns";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessagesForChat } from "../../../../http/chats";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { chatActions } from "../../../../redux/chats";
import ChatMessage from "./ChatMessage";
import {
    ChatDto,
    ChatMessageDto,
} from "../../../../model/interface/chat/chatInterfaces";

interface ChatMessagingWindowProps {
    chatDto: ChatDto;
}

export default function ChatMessagingWindow({
    chatDto,
}: ChatMessagingWindowProps) {
    const dispatch = useDispatchTyped();
    const parentRef = useRef<HTMLDivElement>(null);
    const [didInitialScroll, setDidInitialScroll] = useState(false);

    // Źródło prawdy: kolejność rosnąca (oldest -> newest)
    const messages: ChatMessageDto[] = useMemo(
        () =>
            (chatDto?.messages ?? [])
                .slice()
                .sort((a, b) => +new Date(a.sentAt) - +new Date(b.sentAt)),
        [chatDto?.messages],
    );

    const {
        data: chatMessagesPageDto,
        fetchNextPage,
        isFetchingNextPage,
        isSuccess,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["messages", chatDto?.id],
        queryFn: ({ pageParam = 1 }) =>
            getMessagesForChat(chatDto?.id, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.hasNextSlice ? lastPage.sliceNumber + 1 : undefined,
    });

    // Po każdym sukcesie – zepchnij do store (zadbaj o deduplikację po id w reducerze)
    useEffect(() => {
        if (isSuccess && chatMessagesPageDto) {
            const newMessages = chatMessagesPageDto.pages.flatMap(
                (p) => p.messages,
            );
            dispatch(
                chatActions.addMessages({
                    chatId: chatDto?.id,
                    messages: newMessages,
                }),
            );
        }
    }, [isSuccess, chatMessagesPageDto, dispatch, chatDto?.id]);

    // Wirtualizator
    const virtualizer = useVirtualizer({
        count: messages.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 72, // przybliżenie; i tak mierzymy dynamicznie
        overscan: 8,
        getItemKey: (index) => messages[index]?.id ?? index, // stabilne klucze!
    });

    const items = virtualizer.getVirtualItems();

    // 1) Pierwsze wejście: przewiń na dół
    useLayoutEffect(() => {
        if (!didInitialScroll && messages.length > 0) {
            virtualizer.scrollToIndex(messages.length - 1, { align: "end" });
            setDidInitialScroll(true);
        }
    }, [didInitialScroll, messages.length, virtualizer]);

    // 2) Dociąganie starszych wiadomości: trigger gdy jesteśmy blisko góry
    useEffect(() => {
        if (!parentRef.current) return;
        const first = items[0];
        if (!first) return;

        // “blisko góry”: pierwszy item to index 0 i jego start ~ 0
        if (
            first.index === 0 &&
            first.start < 64 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            const el = parentRef.current;
            const prevScrollBottom = el.scrollHeight - el.scrollTop;

            // pobierz następną stronę (prepend)
            fetchNextPage().then(() => {
                // Po renderze przywróć pozycję (bez “skoku” widoku)
                requestAnimationFrame(() => {
                    const newScrollTop = el.scrollHeight - prevScrollBottom;
                    el.scrollTop = newScrollTop;
                    virtualizer.scrollToOffset(newScrollTop);
                });
            });
        }
    }, [items, hasNextPage, isFetchingNextPage, fetchNextPage, virtualizer]);

    // 3) Auto-scroll na dół przy nowych (najnowszych) wiadomościach, jeśli user jest “blisko dołu”
    const nearBottom = useNearBottom(parentRef, 80);
    useEffect(() => {
        if (nearBottom && messages.length > 0) {
            // np. po przyjściu nowej wiadomości z WebSocketu
            virtualizer.scrollToIndex(messages.length - 1, { align: "end" });
        }
    }, [messages.length, nearBottom, virtualizer]);

    return (
        <div
            className="bg-violetDark/20 scrollbar-thin scrollbar-thumb-violetLight scrollbar-track-violetDark h-full overflow-y-auto py-1"
            ref={parentRef}
            style={{ contain: "strict" }}
        >
            <div
                style={{
                    height: virtualizer.getTotalSize(),
                    position: "relative",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        transform: `translateY(${items[0]?.start ?? 0}px)`,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
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
                                ref={virtualizer.measureElement} // dynamiczna wysokość
                                className="hover:bg-violetLight/40 pl-2"
                            >
                                {thisDate !== prevDate && (
                                    <div className="my-2 flex w-full items-center">
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

function useNearBottom(ref: React.RefObject<HTMLElement>, px = 80) {
    const [near, setNear] = useState(true);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const onScroll = () => {
            const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
            setNear(dist < px);
        };
        onScroll();
        el.addEventListener("scroll", onScroll);
        return () => el.removeEventListener("scroll", onScroll);
    }, [ref, px]);
    return near;
}

function checkIfShouldGroupMessagesByTime(
    message: ChatMessageDto,
    prevMessage?: ChatMessageDto,
): boolean {
    if (!prevMessage) return false;

    const currentMessageSentAtDate = new Date(message.sentAt);
    const previousMessageSentAtDate = new Date(prevMessage.sentAt);

    if (
        currentMessageSentAtDate.toDateString() !==
        previousMessageSentAtDate.toDateString()
    ) {
        return false;
    }

    if (message.sender.id !== prevMessage.sender.id) {
        return false;
    }

    const diffMs = Math.abs(
        currentMessageSentAtDate.getTime() -
            previousMessageSentAtDate.getTime(),
    );
    const diffMinutes = diffMs / 1000 / 60;

    return diffMinutes < 2;
}
