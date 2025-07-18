import { formatSentAt } from "../../../../utils/chat";
import { ChatMessageDto } from "../../../../model/interface/chat/chatInterfaces";

interface MessageProps {
    message: ChatMessageDto;
    shouldGroupMessagesByTime: boolean;
}

export default function ChatMessage({
    message,
    shouldGroupMessagesByTime,
}: MessageProps) {
    return (
        <div className={`mr-5 flex px-2 py-2`}>
            {shouldGroupMessagesByTime ? (
                <p className="ml-16 font-light whitespace-pre-line text-white/95">
                    {message.content}
                </p>
            ) : (
                <>
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
                            <p className="text-xl">{message.sender.name}</p>
                            <p className="flex items-end text-[0.8rem] text-gray-400">
                                {formatSentAt(message.sentAt)}
                            </p>
                        </div>
                        <p className="font-light whitespace-pre-line text-white/95">
                            {message.content}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
