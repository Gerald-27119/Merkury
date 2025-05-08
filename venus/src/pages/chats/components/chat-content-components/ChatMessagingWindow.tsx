// import { ChatDto } from "../../../../redux/chats";
// import { ChatMessageDto } from "../../../../model/interface/chat/chatInterfaces";
// import ChatMessage from "./ChatMessage";
//
// interface ChatMessagingWindowProps {
//     chatDto: ChatDto;
// }
//
// export default function ChatMessagingWindow({
//     chatDto,
// }: ChatMessagingWindowProps) {
//     if (!chatDto || !chatDto?.detailedChatDto?.messages) {
//         return <p className="mb-auto"></p>;
//     }
//     // if (!chatDto || chatDto?.simpleChatDto?.lastMessage?.content == null) {
//     //     return <p className="mb-auto"></p>;
//     // }
//     // for development purposes
//     if (chatDto?.detailedChatDto?.messages.length === 0) {
//         return (
//             <p className="mt-auto px-4 py-1 font-light">
//                 It's the beginning of the conversation with{" "}
//                 <span className="font-semibold">
//                     {chatDto?.simpleChatDto?.name}
//                 </span>
//                 .
//             </p>
//         );
//     }
//     return (
//         // <div className="scrollbar-track-violetDark hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin bg-violetDark/20 flex h-full flex-col gap-4 overflow-y-scroll py-3 pl-2">
//         // flex-col
//         // scroll-snap
//         <div className="scrollbar-track-violetDark scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin bg-violetDark/20 flex h-full flex-col-reverse gap-2 overflow-y-scroll py-1 pl-2">
//             {chatDto?.detailedChatDto?.messages
//                 // .slice()
//                 // .reverse()
//                 .map(
//                     // (message: ChatMessageDto) => <p>{message.content}</p>,
//                     (message: ChatMessageDto) => (
//                         <ChatMessage message={message}></ChatMessage>
//                     ),
//                 )}
//         </div>
//     );
// }
import { ChatDto } from "../../../../redux/chats";
import { ChatMessageDto } from "../../../../model/interface/chat/chatInterfaces";
import ChatMessage from "./ChatMessage";
import { format } from "date-fns";

interface ChatMessagingWindowProps {
    chatDto: ChatDto;
}

export default function ChatMessagingWindow({
    chatDto,
}: ChatMessagingWindowProps) {
    const messages = chatDto?.detailedChatDto?.messages ?? [];

    if (messages.length === 0) {
        return (
            <p className="mt-auto px-4 py-1 font-light">
                It's the beginning of the conversation with{" "}
                <span className="font-semibold">
                    {chatDto?.simpleChatDto?.name}
                </span>
                .
            </p>
        );
    }

    return (
        <div className="scrollbar-track-violetDark scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin bg-violetDark/20 flex h-full flex-col-reverse gap-2 overflow-y-scroll py-1 pl-2">
            {messages.map((message: ChatMessageDto, idx: number) => {
                const thisDate = new Date(message.sentAt).toDateString();
                // poprzednia wiadomość w oryginalnej kolejności (nie reverse)
                const prevMessage = messages[idx + 1];
                const prevDate =
                    prevMessage && new Date(prevMessage.sentAt).toDateString();

                return (
                    <div key={message.id}>
                        {thisDate !== prevDate && (
                            <div className="my-2 flex w-full items-center">
                                <hr className="flex-grow border-gray-500" />
                                <span className="px-2 text-xs text-gray-300">
                                    {format(new Date(message.sentAt), "PPP")}
                                </span>
                                <hr className="flex-grow border-gray-500" />
                            </div>
                        )}
                        <ChatMessage message={message} />
                    </div>
                );
            })}
        </div>
    );
}
