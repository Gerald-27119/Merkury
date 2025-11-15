import ChatList from "./components/ChatList";
import ChatContent from "./components/ChatContent";
import GroupChatParticipantsSideBar from "./components/right-sidebar/GroupChatParticipantsSideBar";
import useSelectorTyped from "../../hooks/useSelectorTyped";

export default function ChatsPage() {
    // TODO: optimize renders using this tool
    // TODO: widok jak ktos nie ma zadnychc chatow

    const showSideBar = useSelectorTyped((s) => s.chats.showSideBar);
    const selectedChatId = useSelectorTyped((s) => s.chats.selectedChatId);
    const selectedChat = useSelectorTyped((s) =>
        selectedChatId != null ? s.chats.entities[selectedChatId] : undefined,
    );

    const isGroup = selectedChat?.chatType === "GROUP";
    return (
        <div className="flex h-screen w-full bg-white dark:text-white">
            <div className="border-violetLight flex w-1/6 flex-col border-l">
                <div className="dark:bg-violetDark border-violetLight flex items-center justify-center border-b py-3 text-center font-medium md:text-lg">
                    <h2>Chats</h2>
                </div>

                <div className="dark:scrollbar-track-violetDark/10 hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin dark:bg-violetDark min-w-0 grow flex-col overflow-y-auto">
                    <ChatList />
                </div>
            </div>

            <div className="dark:bg-violetDark/96 min-w-0 flex-1 bg-white">
                <ChatContent />
            </div>
            {showSideBar && isGroup && (
                <div className="dark:bg-violetDark h-full w-56">
                    <GroupChatParticipantsSideBar />
                </div>
            )}
        </div>
    );
}
