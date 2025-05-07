import { ChatDto } from "../../../../redux/chats";
import { ChatMessageDto } from "../../../../model/interface/chat/chatInterfaces";

interface ChatMessagingWindowProps {
    chatDto: ChatDto;
}

export default function ChatMessagingWindow({
    chatDto,
}: ChatMessagingWindowProps) {
    if (!chatDto || !chatDto?.detailedChatDto?.messages) {
        return <p className="mb-auto"></p>;
    }
    // if (!chatDto || chatDto?.simpleChatDto?.lastMessage?.content == null) {
    //     return <p className="mb-auto"></p>;
    // }
    // for development purposes
    return (
        <div className="scrollbar-track-violetDark hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin bg-violetDark/20 flex h-full flex-col gap-4 overflow-y-scroll py-3 pl-2">
            {chatDto?.detailedChatDto?.messages.map(
                (message: ChatMessageDto) => <p>{message.content}</p>,
            )}
        </div>
    );
}
