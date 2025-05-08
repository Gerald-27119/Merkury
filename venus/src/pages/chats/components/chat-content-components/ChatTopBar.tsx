import { FaPhotoVideo } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { ChatDto } from "../../../../redux/chats";
interface ChatTopBarProps {
    chatDto: ChatDto;
}
export default function ChatTopBar({ chatDto }: ChatTopBarProps) {
    const className: string = "text-2xl";
    return (
        <div className="bg-violetDark flex items-center justify-between gap-4 px-4 py-5">
            <p>{chatDto?.simpleChatDto?.name}</p>
            <div className="mr-2 flex items-center justify-center gap-5">
                <FaSearch className={className} />
                <FaPhotoVideo className={className} />
            </div>
        </div>
    );
}
