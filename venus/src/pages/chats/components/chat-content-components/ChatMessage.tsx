import { formatSentAt } from "../../../../utils/chat";
import { ChatMessageDto } from "../../../../model/interface/chat/chatInterfaces";
import { useBoolean } from "../../../../hooks/useBoolean";
import React from "react";
import ChatMessageFiles from "./chat-message/ChatMessageFiles";

interface MessageProps {
    message: ChatMessageDto;
    shouldGroupMessagesByTime: boolean;
}

export default React.memo(function ChatMessage({
    message,
    shouldGroupMessagesByTime,
}: MessageProps) {
    const [
        shouldShowTooltipWithTime,
        showTooltipWithTime,
        hideTooltipWithTime,
    ] = useBoolean(false);

    return (
        <div
            className={`flex px-2 py-[0.1rem]`}
            onMouseEnter={showTooltipWithTime}
            onMouseLeave={hideTooltipWithTime}
        >
            {shouldGroupMessagesByTime ? (
                <>
                    <div className="flex w-13 justify-center pt-1">
                        {shouldShowTooltipWithTime && (
                            <p className="text-xs dark:text-gray-400">
                                {formatSentAt(message.sentAt)}
                            </p>
                        )}
                    </div>
                    <p className="pl-3 whitespace-pre-line dark:text-white">
                        {shouldShowGif(message.content)
                            ? showGif(message.content)
                            : message.content}
                    </p>

                    <ChatMessageFiles files={message.attachedFiles} />
                </>
            ) : (
                <div className="mt-3 flex">
                    <div className="mr-4 mb-auto flex w-12 items-center justify-center">
                        <img
                            className="aspect-square w-14 rounded-full"
                            src={
                                message.sender.imgUrl
                                    ? `${message.sender.imgUrl}`
                                    : "/users/default.png"
                            }
                            alt={"Sender's image"}
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex gap-2">
                            <p className="text-xl font-semibold">
                                {message.sender.name}
                            </p>
                            <p className="flex items-end text-[0.8rem] dark:text-gray-400">
                                {formatSentAt(message.sentAt)}
                            </p>
                        </div>
                        <p className="whitespace-pre-line dark:text-white">
                            {shouldShowGif(message.content)
                                ? showGif(message.content)
                                : message.content}
                        </p>
                        <ChatMessageFiles files={message.attachedFiles} />
                    </div>
                </div>
            )}
        </div>
    );
});

function showGif(gifUrl: string) {
    return (
        <img
            src={gifUrl}
            alt="GIF"
            className="max-h-64 max-w-64 rounded-lg object-cover"
        />
    );
}

function shouldShowGif(messageContent: string): boolean {
    return messageContent.startsWith("https://media.tenor.com/");
}
