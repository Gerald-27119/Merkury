import ChatList from "./components/ChatList";
import ChatContent from "./components/ChatContent";
import { LuMessageSquarePlus } from "react-icons/lu";

export default function ChatsPage() {
    // TODO: optimize renders using this tool
    // TODO: widok jak ktos nie ma zadnychc chatow
    return (
        <div className="flex h-screen w-full">
            <div className="border-violetLight flex w-1/6 flex-col border-l">
                <div className="bg-violetDark border-violetLight flex items-center justify-center border-b py-3 text-center font-medium text-white md:text-lg">
                    <h2>Chats</h2>
                </div>

                <div className="scrollbar-track-violetDark/10 hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin bg-violetDark/80 min-w-0 grow flex-col overflow-y-auto text-white">
                    <ChatList />
                </div>
            </div>

            <div className="bg-violetDark/96 min-w-0 flex-1 text-white">
                <ChatContent />
            </div>
        </div>
    );
}
