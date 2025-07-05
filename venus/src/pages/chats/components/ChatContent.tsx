import ChatTopBar from "./chat-content-components/ChatTopBar";
import ChatMessagingWindow from "./chat-content-components/ChatMessagingWindow";
import ChatBottomBar from "./chat-content-components/ChatBottomBar";
import useSelectorTyped from "../../../hooks/useSelectorTyped";

import { selectChatById } from "../../../redux/chats";
import { ChatDto } from "../../../model/interface/chat/chatInterfaces";

export default function ChatContent() {
    const selectedChatId: number = useSelectorTyped(
        (state) => state.chats.selectedChatId,
    ); //TODO:change chat to chatActions
    const chatDto: ChatDto = useSelectorTyped((state) =>
        selectChatById(state, selectedChatId),
    );
    // TODO: skeleton tak dlugo jak nie poajwi sie chat w reduxie
    return (
        <div className="flex h-full flex-col">
            <ChatTopBar chatDto={chatDto} />
            <ChatMessagingWindow chatDto={chatDto} />
            <ChatBottomBar />
        </div>
    );
}
