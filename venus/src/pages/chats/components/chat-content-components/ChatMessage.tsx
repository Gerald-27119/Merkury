import { formatSentAt } from "../../../../utils/chat";
import { ChatMessageDto } from "../../../../model/interface/chat/chatInterfaces";
import { useState } from "react";

interface MessageProps {
    message: ChatMessageDto;
    shouldGroupMessagesByTime: boolean;
}

export default function ChatMessage({
    message,
    shouldGroupMessagesByTime,
}: MessageProps) {
    const [shouldShowTooltipWithTime, setShouldShowTooltipWithTime] =
        useState(false);

    return (
        <div
            className={`flex px-2 py-[0.1rem]`}
            onMouseEnter={() => setShouldShowTooltipWithTime(true)}
            onMouseLeave={() => setShouldShowTooltipWithTime(false)}
        >
            {shouldGroupMessagesByTime ? (
                <>
                    <div className="flex w-13 justify-center pt-1">
                        {shouldShowTooltipWithTime && (
                            <p className="text-xs text-gray-400">
                                {formatSentAt(message.sentAt)}
                            </p>
                        )}
                    </div>
                    <p className="pl-3 whitespace-pre-line text-white">
                        {message.content}
                    </p>
                </>
            ) : (
                <div className="mt-3 flex">
                    <div className="mr-4 flex w-12 items-center justify-center">
                        <img
                            className="aspect-square w-14 rounded-full"
                            src={
                                message.sender.imgUrl // for development purposes
                                    ? `/users/${message.sender.imgUrl}`
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
                            <p className="flex items-end text-[0.8rem] text-gray-400">
                                {formatSentAt(message.sentAt)}
                            </p>
                        </div>
                        <p className="whitespace-pre-line text-white">
                            {message.content}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
