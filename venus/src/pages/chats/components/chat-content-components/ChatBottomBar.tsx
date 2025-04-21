import MessageInput from "./bottom-bar-components/MessageInput";
import { IoSendSharp } from "react-icons/io5";

export default function ChatBottomBar() {
  return (
    <div className="bg-violetDark flex items-center justify-center gap-4 px-1 py-3">
      <MessageInput />
      <IoSendSharp className="mr-2 h-7 w-7" />
    </div>
  );
}
