import { DetailedChats } from "../../chatMockData";
import Message from "./Message";

export default function ChatMessagingWindow() {
  const selectedChatId = 1;

  const chat = DetailedChats[selectedChatId];
  const chatMessages = chat.messages;

  return (
    <div className="scrollbar-track-violetDark hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin bg-violetDark/20 flex h-full flex-col gap-4 overflow-y-scroll py-3 pl-2">
      {chatMessages.map((message) => (
        <Message message={message} key={message.id} />
      ))}
    </div>
  );
}
