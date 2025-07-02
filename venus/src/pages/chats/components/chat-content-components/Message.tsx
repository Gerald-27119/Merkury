import { formatSentAt } from "../../../../utils/chat";
import { ChatMessageDto } from "../../../../model/interface/chat/chatInterfaces";

interface MessageProps {
    message: ChatMessageDto;
    isCurrentUsers: boolean;
}

export default function Message({ message, isCurrentUsers }: MessageProps) {
    return (
        <div
            className={`bg-violetDark mr-5 flex w-fit gap-4 px-2 py-2 ${isCurrentUsers && "ml-auto"}`}
        >
            <div className="w-10">
                <img
                    className="aspect-square w-14 rounded-full"
                    src={message.sender.imgUrl}
                    alt={"Sender's image"}
                />
            </div>
            <div className="flex flex-col">
                <div className="flex gap-2">
                    <p>{message.sender.name}</p>
                    <p>{formatSentAt(message.sentAt)}</p>
                </div>
                <p className="text-white/80">{message.content}</p>
            </div>
        </div>
    );
}
