import React, {
    useState,
    useCallback,
    useRef,
    ChangeEvent,
    useEffect,
} from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { IoSendSharp } from "react-icons/io5";
import { RiEmotionHappyFill } from "react-icons/ri";
import { MdGifBox, MdOutlinePhotoSizeSelectActual } from "react-icons/md";
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
import {
    useQueryClient,
    InfiniteData,
    useMutation,
} from "@tanstack/react-query";
import ChatUploadFiles from "../ChatUploadFiles";
import { sendFiles } from "../../../../http/chats";

type LocalMsg = ChatMessageDto & { optimistic?: true; optimisticUUID?: string };

export default function ChatBottomBar() {
    const iconClasses =
        "text-violetLighter text-2xl hover:cursor-pointer hover:text-white/80";

    const [messageToSend, setMessageToSend] = useState("");
    const [isSending, setIsSending] = useState(false);

    const { publish, connected } = useWebSocket();
    const { selectedChatId } = useSelectorTyped((s) => s.chats);
    const username = useSelectorTyped((s) => s.account.username);

    const dispatch = useDispatchTyped();
    const queryClient = useQueryClient();

    const [activeGifEmojiWindow, setActiveGifEmojiWindow] = useState<
        "emoji" | "gif" | null
    >(null);
    const gifEmojiWindowRef = useRef<HTMLDivElement>(null);
    useClickOutside(
        gifEmojiWindowRef,
        () => setActiveGifEmojiWindow(null),
        activeGifEmojiWindow !== null,
    );
    const { isSuccess, mutate: sendFilesMutation } = useMutation({
        mutationKey: ["send-chat-files"],
        mutationFn: () => sendFiles(selectedChatId, files),
    });
    const sendMessage = useCallback(async () => {
        console.log("Sending files!");
        sendFilesMutation();
        console.log("Sending message");

        const text = messageToSend.trim();
        if (!text || !connected || !selectedChatId) return;

        const chatId = selectedChatId;

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

        dispatch(chatActions.setLastMessage({ chatId, message: optimistic }));

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
        sendFilesMutation,
    ]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    function onFileSelect(files: File[]) {
        console.log(...files);
    }

    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;

        const allowed = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
        const valid = Array.from(event.target.files).filter((f) =>
            allowed.includes(f.type),
        );

        setFiles(valid);
        const newPreviews = valid.map((file) => URL.createObjectURL(file));
        setPreviews(newPreviews);

        onFileSelect(valid);
    };

    useEffect(() => {
        return () => {
            previews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previews]);

    return (
        <div className="flex items-center justify-center gap-4 px-3 py-3">
            <div className="bg-violetLight/25 mr-1 flex w-full flex-col gap-3 rounded-xl px-3 py-3 shadow-md">
                {files.length >= 1 && (
                    <div className="mb-4 flex gap-2 p-1">
                        {files.map((file, index) => {
                            const previewUrl = previews[index];

                            if (file.type.startsWith("image/")) {
                                return (
                                    <img
                                        key={index}
                                        src={previewUrl}
                                        alt={file.name}
                                        className="h-16 w-16 rounded-md object-cover"
                                    />
                                );
                            }

                            // return (
                            //     <video
                            //         key={index}
                            //         src={previewUrl}
                            //         className="h-12 w-12 rounded-md bg-gray-200 object-cover"
                            //     />
                            // );
                        })}
                    </div>
                )}

                <div className="flex w-full">
                    <button onClick={handleButtonClick} className="mr-3">
                        <FaCirclePlus className={iconClasses} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        multiple
                        accept="image/*"
                    />

                    <textarea
                        className="scrollbar-track-violetDark/10 hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin mt-auto w-full resize-none bg-transparent focus:border-none focus:outline-none"
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
                                setActiveGifEmojiWindow={
                                    setActiveGifEmojiWindow
                                }
                                setMessageToSend={setMessageToSend}
                            />
                        )}
                    </div>
                </div>
            </div>
            <button
                onClick={sendMessage}
                disabled={
                    !connected ||
                    isSending ||
                    (!messageToSend.trim() && files.length === 0)
                }
                className="mt-auto mb-2 hover:cursor-pointer disabled:opacity-50"
                title={!connected ? "Connecting..." : "Send"}
            >
                <IoSendSharp className="mr-4 h-7 w-7 shadow-md" />
            </button>
        </div>
    );
}
