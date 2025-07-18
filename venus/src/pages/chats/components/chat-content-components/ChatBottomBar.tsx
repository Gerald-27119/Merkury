import React, { useState, useCallback } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { IoSendSharp } from "react-icons/io5";
import { RiEmotionHappyFill } from "react-icons/ri";
import { MdGifBox } from "react-icons/md";
import { useWebSocket } from "../../../../stomp/useWebSocket";
import { ChatMessageToSendDto } from "../../../../model/interface/chat/chatInterfaces";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";

// TODO: use https://www.npmjs.com/package/react-textarea-autosize

export default function ChatBottomBar() {
    const iconClass = "text-violetLighter text-3xl";

    const [messageToSend, setMessageToSend] = useState("");
    const [isSending, setIsSending] = useState(false);

    // Tu używam globalnego hooka useWebSocket, który zarządza połączeniem WebSocket
    const { publish, connected } = useWebSocket();
    const { selectedChatId } = useSelectorTyped((state) => state.chats);

    const sendMessage = useCallback(async () => {
        if (!messageToSend.trim() || !connected) return;

        const formatted: ChatMessageToSendDto = {
            chatId: selectedChatId,
            content: messageToSend,
            sentAt: new Date().toISOString(),
        };

        setIsSending(true);
        try {
            publish(`/app/send/${selectedChatId}/message`, formatted);
            setMessageToSend("");
            // TODO: uzyskać potwierdzenie ACK
        } finally {
            setIsSending(false);
        }
    }, [messageToSend, selectedChatId, connected, publish]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter") {
            if (e.shiftKey) {
                return;
            }
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="flex items-center justify-center gap-4 px-3 py-3">
            <div className="bg-violetLight/25 mr-1 flex w-full gap-3 rounded-xl px-3 py-3 shadow-md">
                <FaCirclePlus className={iconClass} />

                <textarea
                    className="scrollbar-track-violetDark/10 hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin w-full resize-none bg-transparent focus:border-none focus:outline-none"
                    placeholder="Message..."
                    value={messageToSend}
                    onChange={(e) => setMessageToSend(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                />

                <MdGifBox className={iconClass} />
                <RiEmotionHappyFill className={iconClass} />
            </div>

            <button
                onClick={sendMessage}
                disabled={!connected || isSending}
                className="hover:cursor-pointer disabled:opacity-50"
            >
                <IoSendSharp className="mr-4 h-7 w-7 shadow-md" />
            </button>
        </div>
    );
}
