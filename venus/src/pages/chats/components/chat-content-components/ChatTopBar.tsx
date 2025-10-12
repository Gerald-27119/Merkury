import { FaPhotoVideo } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { ChatDto } from "../../../../model/interface/chat/chatInterfaces";
import { useNavigate } from "react-router-dom";
import { CiSettings } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { HiUserAdd } from "react-icons/hi";
import { useBoolean } from "../../../../hooks/useBoolean";
import EmptyModal from "../../../../components/modal/EmptyModal";
import SearchFriendsList from "../../../account/social/components/SearchFriendsList";
import AddPeopleToGroupChatSearchModal from "./chat-top-bar-components/AddPeopleToGroupChatSearchModal";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { chatActions } from "../../../../redux/chats";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";

interface ChatTopBarProps {
    chatDto: ChatDto;
}

export default function ChatTopBar({ chatDto }: ChatTopBarProps) {
    const navigate = useNavigate();
    const [isOpen, open, close, _] = useBoolean(false);
    const dispatch = useDispatchTyped();
    const username = useSelectorTyped((state) => state.account.username);

    function handleChatNameClick() {
        if (chatDto.chatType === "PRIVATE") {
            navigate(`/account/profile/${chatDto.name}`); // TODO: chatName moze byc customowy, to trzeba na userID podmienic
        } else {
            return;
        }
    }

    function handleOpenCreateGroupChatModal() {
        console.log(chatDto);
        if (chatDto.chatType === "PRIVATE") {
            const other = chatDto.participants?.find(
                (p) => p.username !== username,
            );
            console.log(other);
            if (other) {
                dispatch(chatActions.addUserToAddToChat(other.username));
            }
        }
        open();
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
                <HiUserAdd
                    size={30}
                    className="hover:cursor-pointer"
                    onClick={handleOpenCreateGroupChatModal}
                />
            </div>
            <EmptyModal
                onClose={close}
                isOpen={isOpen}
                className="h-3/4 w-3/4 overflow-y-hidden"
            >
                <AddPeopleToGroupChatSearchModal onClose={close} />
            </EmptyModal>
        </div>
    );
}
