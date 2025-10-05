import { FaPhotoVideo } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { ChatDto } from "../../../../model/interface/chat/chatInterfaces";
import { useNavigate } from "react-router-dom";
import { CiSettings } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";

interface ChatTopBarProps {
    chatDto: ChatDto;
}

export default function ChatTopBar({ chatDto }: ChatTopBarProps) {
    const navigate = useNavigate();

    function handleChatNameClick() {
        console.log("Chat name clicked " + chatDto.name + chatDto.chatType);
        if (chatDto.chatType === "PRIVATE") {
            navigate(`/account/profile/${chatDto.name}`); // TODO: chatName moze byc customowy, to trzeba na userID podmienic
        } else {
            return;
        }
    }

    return (
        <div className="bg-violetDark flex items-center justify-between gap-4 px-4 py-5">
            <button
                className="flex items-center gap-3 rounded-xl p-3 hover:cursor-pointer hover:bg-purple-400/20"
                onClick={handleChatNameClick}
            >
                <img
                    className="aspect-square w-9 rounded-full"
                    src={
                        chatDto?.imgUrl
                            ? // for development purposes
                              `/users/${chatDto?.imgUrl}`
                            : "/users/default.png"
                    }
                    alt={"Image that listed chat has"}
                />
                {/*TODO: pzejscie do profilu usera jezeli chat jest prywanty, jezeli grupowy to otwarcie listy userow*/}
                <p className="text-lg font-semibold text-white">
                    {chatDto?.name}
                </p>
            </button>
            <div className="flex items-center justify-center">
                <IoSettingsOutline size={30} className="hover:cursor-pointer" />
            </div>
        </div>
    );
}
