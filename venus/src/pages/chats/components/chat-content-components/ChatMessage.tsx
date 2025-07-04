import { formatSentAt } from "../../../../utils/chat";
import { ChatMessageDto } from "../../../../model/interface/chat/chatInterfaces";

interface MessageProps {
    message: ChatMessageDto;
}

export default function ChatMessage({ message }: MessageProps) {
    return (
        <div className={`mr-5 flex gap-4 px-2 py-2`}>
            <div className="flex w-12 items-center justify-center">
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
                <p className="font-light text-white/95">{message.content}</p>
            </div>
        </div>
    );
}
