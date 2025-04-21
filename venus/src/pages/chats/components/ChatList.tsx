import ListedChat from "./ListedChat";
import { ListedChatDto, MockChatListData } from "../chatMockData";

export default function ChatList() {
  return (
    <>
      {MockChatListData.map((chat: ListedChatDto) => (
        <ListedChat listedChatDto={chat} key={chat.id} />
      ))}
    </>
  );
}
