import ChatTopBar from "./chat-content-components/ChatTopBar";
import ChatMessagingWindow from "./chat-content-components/ChatMessagingWindow";
import ChatBottomBar from "./chat-content-components/ChatBottomBar";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import { selectChatById } from "../../../redux/chats";

export default function ChatContent() {
    const selectedChatId = useSelectorTyped((s) => s.chats.selectedChatId);
    const chatDto = useSelectorTyped((s) => selectChatById(s, selectedChatId));

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="shrink-0">
                <ChatTopBar chatDto={chatDto} />
            </div>

            <div className="min-h-0 flex-1">
                <ChatMessagingWindow chatDto={chatDto} />
            </div>

            <div className="shrink-0">
                <ChatBottomBar />
            </div>
        </div>
    );
}
