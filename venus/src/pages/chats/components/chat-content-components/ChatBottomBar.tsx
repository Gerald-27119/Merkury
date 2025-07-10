import { useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { IoSendSharp } from "react-icons/io5";
import { RiEmotionHappyFill } from "react-icons/ri";
import { MdGifBox } from "react-icons/md";
import { useWebSocket } from "../../../../stomp/useWebSocket";
import { ChatMessageToSendDto } from "../../../../model/interface/chat/chatInterfaces";

export default function ChatBottomBar() {
    const className = "text-violetLighter text-3xl";

    const [messageToSend, setMessageToSend] = useState("");
    const [isSending, setIsSending] = useState(false);

    // Tu używamy hooka useWebSocket — możesz też przekazać opcjonalne subskrypcje!
    const { publish, connected } = useWebSocket();

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setMessageToSend(e.target.value);
    }

    async function sendMessage() {
        if (!messageToSend.trim() || !connected) return;

        const formatted: ChatMessageToSendDto = {
            chatId: 1,
            sender: {
                id: 1,
                name: "user1",
                imgUrl: "user1.png",
            },
            content: messageToSend,
            sentAt: new Date().toISOString(),
        };

        setIsSending(true);
        try {
            publish("/app/send/1/message", formatted);
            setMessageToSend("");
            //TODO:add ACK confirmation
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="flex items-center justify-center gap-4 px-3 py-3">
            <div className="bg-violetLight/25 mr-1 flex w-full gap-3 rounded-xl px-3 py-3 shadow-md">
                <FaCirclePlus className={className} />

                <input
                    className="w-full focus:border-none focus:outline-none"
                    placeholder="Message..."
                    type="text"
                    onChange={onInputChange}
                    value={messageToSend}
                ></input>

                <MdGifBox className={className} />
                <RiEmotionHappyFill className={className} />
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
