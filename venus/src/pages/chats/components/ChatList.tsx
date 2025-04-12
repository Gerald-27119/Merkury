import ListedChat from "./ListedChat";

export default function ChatList() {
  const chats = [
    {
      id: 1,
      name: "Chat 1",
    },
    {
      id: 2,
      name: "Chat 2",
    },
    {
      id: 3,
      name: "Chat 3",
    },
  ];

  return (
    <div>
      {chats.map((chat) => (
        <ListedChat x={chat.id} key={chat.id} />
      ))}
    </div>
  );
}
