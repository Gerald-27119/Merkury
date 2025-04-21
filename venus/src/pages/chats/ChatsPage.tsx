import ChatList from "./components/ChatList";
import ChatContent from "./components/ChatContent";

export default function ChatsPage() {
  // 5 mocked group chats
  // 10 mocked chats 1 to 1

  return (
    <div className="flex h-screen w-full">
      <div className="border-violetLight flex flex-col border-l">
        <div className="bg-violetDark border-violetLight border-b py-5 text-center font-medium text-white md:text-lg">
          <h2>Friends</h2>
        </div>
        <div className="scrollbar-track-violetDark hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin bg-violetDark min-w-0 flex-col overflow-y-auto text-white">
          <ChatList />
        </div>
      </div>

      <div className="bg-violetDark/96 min-w-0 flex-1 text-white">
        <ChatContent x={1} />
      </div>
    </div>
  );
}
