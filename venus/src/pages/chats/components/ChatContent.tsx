import ChatTopBar from "./chat-content-components/ChatTopBar";
import ChatMessagingWindow from "./chat-content-components/ChatMessagingWindow";
import ChatBottomBar from "./chat-content-components/ChatBottomBar";

export default function ChatContent() {
  return (
    <div className="flex h-full flex-col">
      <ChatTopBar />
      <ChatMessagingWindow />
      <ChatBottomBar />
    </div>
  );
}
