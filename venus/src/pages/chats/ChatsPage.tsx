import ChatList from "./components/ChatList";
import ChatContent from "./components/ChatContent";

export default function ChatsPage() {
  return (
    <div>
      <div>
        <ChatList />
      </div>
      <div>
        <ChatContent x={1} />
      </div>
    </div>
  );
}
