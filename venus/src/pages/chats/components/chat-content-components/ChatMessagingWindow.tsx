import {
    ChatDto,
    ChatMessageDto,
} from "../../../../model/interface/chat/chatInterfaces";
import ChatMessage from "./ChatMessage";
import { format } from "date-fns";

interface ChatMessagingWindowProps {
    chatDto: ChatDto;
}

export default function ChatMessagingWindow({
    chatDto,
}: ChatMessagingWindowProps) {
    const messages = chatDto?.messages ?? [];

    if (messages.length === 0) {
        return (
            <p className="mt-auto px-4 py-1 font-light">
                It's the beginning of the conversation with{" "}
                <span className="font-semibold">{chatDto?.name}</span>.
            </p>
        );
    }

    //TODO: add fetch more messages on scroll
    // TODO: poalczc na wpsolnej godzinie
    return (
        <div className="scrollbar-track-violetDark scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin bg-violetDark/20 flex h-full flex-col-reverse overflow-y-scroll py-1">
            {messages.map((message: ChatMessageDto, idx: number) => {
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

    if (current.toDateString() !== previous.toDateString()) {
        return false;
    }

    if (message.sender.id !== prevMessage.sender.id) {
        return false;
    }

    const diffMs = Math.abs(current.getTime() - previous.getTime());
    const diffMinutes = diffMs / 1000 / 60;

    return diffMinutes < 2;
}
