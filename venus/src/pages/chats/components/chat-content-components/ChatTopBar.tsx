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
            <div className="flex items-center gap-3">
                {/*TODO:make that src as component?*/}
                <img
                    className="aspect-square w-9 rounded-full"
                    src={
                        chatDto?.simpleChatDto?.imgUrl
                            ? // for development purposes
                              `/public/users/${chatDto?.simpleChatDto?.imgUrl}`
                            : "/public/users/default.png"
                    }
                    alt={"Image that listed chat has"}
                />
                <p className="text-lg font-semibold">
                    {chatDto?.simpleChatDto?.name}
                </p>
            </div>
            <div className="mr-2 flex items-center justify-center gap-5">
                <FaSearch className={className} />
                <FaPhotoVideo className={className} />
            </div>
        </div>
    );
}
