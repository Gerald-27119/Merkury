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
import { MdGifBox } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
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
import { sendFiles } from "../../../../http/chats";
import { FileIcon } from "./chat-message/ChatMessageFiles";

type LocalMsg = ChatMessageDto & { optimistic?: true; optimisticUUID?: string };

const ACCEPT = [
    "image/*",
    "application/pdf",
    ".pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".doc",
    ".docx",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xls",
    ".xlsx",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".ppt",
    ".pptx",
    "text/csv",
    ".csv",
    "text/plain",
    ".txt",
    "application/zip",
    "application/x-7z-compressed",
    "application/x-rar-compressed",
    ".zip",
    ".7z",
    ".rar",
].join(",");

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

    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const clearAttachments = useCallback(() => {
        previews.forEach((url) => URL.revokeObjectURL(url));
        setPreviews([]);
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [previews]);

    const { mutateAsync: sendFilesMutation } = useMutation({
        mutationKey: ["send-chat-files"],
        mutationFn: async (vars: { chatId: number; files: File[] }) =>
            sendFiles(vars.chatId, vars.files),
    });

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const filesToSend = Array.from(event.target.files);
        setFiles(filesToSend);
        const newPreviews = filesToSend.map((file) =>
            URL.createObjectURL(file),
        );
        setPreviews(newPreviews);
    };

    useEffect(() => {
        return () => {
            previews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const sendMessage = useCallback(async () => {
        if (files.length > 0 && selectedChatId) {
            try {
                await sendFilesMutation({ chatId: selectedChatId, files });
            } catch (e) {
                console.error("File upload failed", e);
            }
        }

        const text = messageToSend.trim();
        if (!connected || !selectedChatId) {
            clearAttachments();
            return;
        }

        if (text) {
            const chatId = selectedChatId;

            const optimisticUUID =
                typeof crypto !== "undefined" && "randomUUID" in crypto
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

            const optimistic: LocalMsg = {
                id: -Date.now(),
                chatId,
                content: text,
                sentAt: new Date().toISOString(),
                sender: { id: -1, name: username || "You", imgUrl: "" },
                optimistic: true,
                optimisticUUID,
            };

            dispatch(
                chatActions.setLastMessage({ chatId, message: optimistic }),
            );

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
                            c.id === chatId
                                ? { ...c, lastMessage: optimistic }
                                : c,
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
        }

        clearAttachments();
    }, [
        files,
        messageToSend,
        connected,
        selectedChatId,
        publish,
        dispatch,
        queryClient,
        username,
        sendFilesMutation,
        clearAttachments,
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

    return (
        <div className="flex items-center justify-center gap-4 px-3 py-3">
            <div className="bg-violetLight/25 mr-1 flex w-full flex-col gap-3 rounded-xl px-3 py-3 shadow-md">
                {files.length >= 1 && (
                    <div className="mb-4 flex gap-2 p-1">
                        {files.map((file, index) => {
                            const previewUrl = previews[index];

                            if (file.type.startsWith("image/")) {
                                return (
                                    <div
                                        key={`${file.name}-${index}`}
                                        className="group relative h-16 w-16 overflow-hidden rounded-md"
                                    >
                                        <a
                                            href={previewUrl}
                                            download={file.name}
                                            title={`Pobierz: ${file.name}`}
                                            className="block"
                                        >
                                            <img
                                                src={previewUrl}
                                                alt={file.name}
                                                className="block h-16 w-16 cursor-pointer object-cover transition duration-300 select-none group-hover:scale-[1.01] group-hover:brightness-75"
                                                draggable={false}
                                            />
                                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                                                <FaDownload className="text-white" />
                                            </div>
                                        </a>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="flex h-16 w-24 flex-col items-center justify-center gap-1 rounded-md bg-black/10 p-1"
                                >
                                    <FileIcon
                                        mime={file.type}
                                        filename={file.name}
                                        size={24}
                                    />
                                    <span
                                        className="w-full truncate text-xs"
                                        title={file.name}
                                    >
                                        {file.name}
                                    </span>
                                </div>
                            );
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
                        accept={ACCEPT}
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
