import MessageInput from "./bottom-bar-components/MessageInput";
import { FaCirclePlus } from "react-icons/fa6";
import { IoSendSharp } from "react-icons/io5";
import { RiEmotionHappyFill } from "react-icons/ri";
import { MdGifBox } from "react-icons/md";
import { SetStateAction, useState } from "react";
import { useStomp } from "../../../../stomp/useStomp";
import { WebSocketChatMessage } from "../../../../stomp/stompClient";

export default function ChatBottomBar() {
    const className = "text-violetLighter text-3xl";
    const [messageToSend, setMessageToSend] = useState("");
    const [isSending, setIsSending] = useState(false);
    const { sendMessage: stompSendMessage } = useStomp(
        "ws://localhost:8080/connect",
    ); // Update broker URL as needed

    function onInputChange(event: {
        target: { value: SetStateAction<string> };
    }) {
        setMessageToSend(event.target.value);
    }

    function sendMessage() {
        const formatedMessageToSend: WebSocketChatMessage = {
            chatId: 1,
            sender: {
                id: 1,
                username: "testUser",
            },
            content: messageToSend,
        };
        console.log("Sending message:", JSON.stringify(formatedMessageToSend));
        setIsSending(true);

        // Send the message via the STOMP client
        stompSendMessage(
            "/app/send/1/message",
            JSON.stringify(formatedMessageToSend),
        );

        // Simulate waiting for an ACK/confirmation from the server.
        // In a real-world scenario, you'd subscribe to an ACK topic or use a callback.
        setTimeout(() => {
            setIsSending(false);
            console.log("ACK received: Message sent."); //kłamstwo
        }, 1500);
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

            <button onClick={sendMessage} className="hover:cursor-pointer">
                <IoSendSharp className="mr-4 h-7 w-7 shadow-md" />
            </button>
        </div>
    );
}
