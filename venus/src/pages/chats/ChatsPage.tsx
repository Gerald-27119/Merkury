import ChatList from "./components/ChatList";
import ChatContent from "./components/ChatContent";
import { LuMessageSquarePlus } from "react-icons/lu";

export default function ChatsPage() {
  return (
    <div className="flex h-screen w-full">
      <div className="border-violetLight flex flex-col border-l">
        <div className="bg-violetDark border-violetLight flex items-center justify-end gap-20 border-b py-5 text-center font-medium text-white md:text-lg">
          {/*  TODO: move both firends and new message to the sidebar, only leave text: Chats: ?*/}
          <h2>Friends</h2>
          <LuMessageSquarePlus size={30} className="mr-5" />
        </div>

        <div className="scrollbar-track-violetDark hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin bg-violetDark min-w-0 flex-col overflow-y-auto text-white">
          <ChatList />
        </div>
      </div>

      <div className="bg-violetDark/96 min-w-0 flex-1 text-white">
        <ChatContent />
      </div>
    </div>
  );
}
