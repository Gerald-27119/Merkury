import ChatTopBar from "./chat-content-components/ChatTopBar";
import ChatMessagingWindow from "./chat-content-components/ChatMessagingWindow";
import ChatBottomBar from "./chat-content-components/ChatBottomBar";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import { selectChatById } from "../../../redux/chats";
import type { ChatDto } from "../../../model/interface/chat/chatInterfaces";

export default function ChatContent() {
    const selectedChatId = useSelectorTyped<number | null>(
        (state) => state.chats.selectedChatId,
    );

    const chatDto = useSelectorTyped<ChatDto | undefined>((state) =>
        selectedChatId != null
            ? selectChatById(state, selectedChatId)
            : undefined,
    );

    // ⬇️ bezpieczny fallback gdy nie wybrano czatu / brak danych
    if (selectedChatId == null || !chatDto) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                Select a chat to start messaging…
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <ChatTopBar chatDto={chatDto} />
            <ChatMessagingWindow key={chatDto.id} chatDto={chatDto} />
            <ChatBottomBar />
        </div>
    );
}
