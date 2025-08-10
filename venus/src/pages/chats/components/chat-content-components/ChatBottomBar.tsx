import React, { useState, useCallback, useRef } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { IoSendSharp } from "react-icons/io5";
import { RiEmotionHappyFill } from "react-icons/ri";
import { MdGifBox } from "react-icons/md";
import { useWebSocket } from "../../../../stomp/useWebSocket";
import {
    ChatMessageToSendDto,
    ChatMessageDto,
    ChatMessagesPageDto,
    ChatPage,
} from "../../../../model/interface/chat/chatInterfaces";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { chatActions } from "../../../../redux/chats";
import EmojiGifWindowWrapper from "./bottom-bar-components/EmojiGifWindow/EmojiGifWindowWrapper";
import { useClickOutside } from "../../../../hooks/useClickOutside";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";

type LocalMsg = ChatMessageDto & { optimistic?: true; optimisticUUID?: string };

export default function ChatBottomBar() {
    const iconClasses =
        "text-violetLighter text-2xl hover:cursor-pointer hover:text-white/80";

    const [messageToSend, setMessageToSend] = useState("");
    const [isSending, setIsSending] = useState(false);

    const { publish, connected } = useWebSocket();
    const { selectedChatId } = useSelectorTyped((s) => s.chats);
    const username = useSelectorTyped((s) => s.account.username); // tylko dla UI

    const dispatch = useDispatchTyped();
    const queryClient = useQueryClient();

    const [activeGifEmojiWindow, setActiveGifEmojiWindow] = useState<
        "emoji" | "gif" | null
    >(null);
    const gifEmojiWindowRef = useRef<HTMLDivElement>(null);
    useClickOutside(gifEmojiWindowRef, () => setActiveGifEmojiWindow(null));

    const sendMessage = useCallback(async () => {
        const text = messageToSend.trim();
        if (!text || !connected || !selectedChatId) return;

        const chatId = selectedChatId;

        // UUID do korelacji ACK <-> optymista
        const optimisticUUID =
            typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        // ujemne ID = optymistyczne
        const optimistic: LocalMsg = {
            id: -Date.now(),
            chatId,
            content: text,
            sentAt: new Date().toISOString(),
            sender: { id: -1, name: username || "You", imgUrl: "" },
            optimistic: true,
            optimisticUUID,
        };

        // A) natychmiast podbij lastMessage w Reduxie (lista czatów)
        dispatch(chatActions.setLastMessage({ chatId, message: optimistic }));

        // B) dopnij optymistę do pierwszej strony historii (flex-col-reverse)
        queryClient.setQueryData<InfiniteData<ChatMessagesPageDto>>(
            ["messages", chatId],
            (old) => {
                if (!old) return old;
                const first = old.pages[0] ?? {
                    messages: [],
                    hasNextSlice: true,
                    numberOfMessages: 0,
                    sliceNumber: 0,
                };
                const newFirst = {
                    ...first,
                    messages: [
                        optimistic as ChatMessageDto,
                        ...(first.messages ?? []),
                    ],
                };
                return { ...old, pages: [newFirst, ...old.pages.slice(1)] };
            },
        );

        // C) jeśli masz w pamięci listę czatów z React Query — podmień jej lastMessage
        queryClient.setQueriesData<InfiniteData<ChatPage>>(
            { queryKey: ["user-chat-list"] },
            (old) => {
                if (!old) return old;
                const pages = old.pages.map((p) => ({
                    ...p,
                    items: p.items.map((c) =>
                        c.id === chatId ? { ...c, lastMessage: optimistic } : c,
                    ),
                }));
                return { ...old, pages };
            },
        );

        // D) wyślij do backendu (BE bierze username z JWT; dodajemy tylko optimisticMessageUUID)
        const payload: ChatMessageToSendDto & {
            optimisticMessageUUID: string;
        } = {
            chatId,
            content: text,
            sentAt: optimistic.sentAt,
            optimisticMessageUUID: optimisticUUID,
        };

        setIsSending(true);
        try {
            publish(`/app/send/${chatId}/message`, payload);
            setMessageToSend("");
        } finally {
            setIsSending(false);
        }
    }, [
        messageToSend,
        connected,
        selectedChatId,
        publish,
        dispatch,
        queryClient,
        username,
    ]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="flex items-center justify-center gap-4 px-3 py-3">
            <div className="bg-violetLight/25 mr-1 flex w-full gap-3 rounded-xl px-3 py-3 shadow-md">
                <FaCirclePlus className={iconClasses} />

                <textarea
                    className="scrollbar-track-violetDark/10 hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin w-full resize-none bg-transparent focus:border-none focus:outline-none"
                    placeholder="Message..."
                    value={messageToSend}
                    onChange={(e) => setMessageToSend(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                />

                <div
                    ref={gifEmojiWindowRef}
                    className="flex items-center gap-2"
                >
                    <MdGifBox
                        className={iconClasses}
                        onClick={() =>
                            setActiveGifEmojiWindow((prev) =>
                                prev === "gif" ? null : "gif",
                            )
                        }
                    />
                    <RiEmotionHappyFill
                        className={iconClasses}
                        onClick={() =>
                            setActiveGifEmojiWindow((prev) =>
                                prev === "emoji" ? null : "emoji",
                            )
                        }
                    />
                    {activeGifEmojiWindow && (
                        <EmojiGifWindowWrapper
                            windowName={activeGifEmojiWindow}
                            setActiveGifEmojiWindow={setActiveGifEmojiWindow}
                        />
                    )}
                </div>
            </div>

            <button
                onClick={sendMessage}
                disabled={!connected || isSending || !messageToSend.trim()}
                className="hover:cursor-pointer disabled:opacity-50"
                title={!connected ? "Connecting..." : "Send"}
            >
                <IoSendSharp className="mr-4 h-7 w-7 shadow-md" />
            </button>
        </div>
    );
}
