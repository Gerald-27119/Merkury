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
import CreateGroupChatModal from "./chat-top-bar-components/CreateGroupChatModal";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { chatActions } from "../../../../redux/chats";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { FaUsers } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import EditGroupChatModal from "./chat-top-bar-components/EditGroupChatModal";
import AddPeopleToGroupChatModal from "./chat-top-bar-components/AddPeopleToGroupChatModal";

interface ChatTopBarProps {
    chatDto: ChatDto;
}

export default function ChatTopBar({ chatDto }: ChatTopBarProps) {
    const navigate = useNavigate();
    const [isOpen, open, close, _] = useBoolean(false);
    const [isOpenGroup, openGroup, closeGroup, empty] = useBoolean(false);
    const [isOpenAdd, openAdd, closeAdd, emptyAdd] = useBoolean(false);
    const dispatch = useDispatchTyped();
    const username = useSelectorTyped((state) => state.account.username);

    function handleOpenSidebar() {
        dispatch(chatActions.toggleShowSideBar());
    }

    function handleChatNameClick() {
        if (chatDto.chatType === "PRIVATE") {
            navigate(`/account/profile/${chatDto.name}`); // TODO: chatName moze byc customowy, to trzeba na userID podmienic
        } else {
            return;
        }
    }

    function handleOpenCreateGroupChatModal() {
        if (chatDto.chatType === "PRIVATE") {
            const other = chatDto.participants?.find(
                (p) => p.username !== username,
            );
            if (other) {
                dispatch(chatActions.addUserToAddToChat(other.username));
            }
        }
        open();
    }

    function handleGroupChatNameClick() {
        openGroup();
    }

    function handleOpenAddPeopleToGroupChatModal() {
        openAdd();
    }

    return (
        <div className="bg-violetDark flex items-center justify-between gap-4 px-4 py-5">
            {chatDto.chatType === "PRIVATE" ? (
                <button
                    className="flex min-w-0 items-center gap-3 rounded-xl p-3 hover:cursor-pointer hover:bg-purple-400/20"
                    onClick={handleChatNameClick}
                >
                    <img
                        className="aspect-square w-9 rounded-full"
                        src={
                            chatDto?.imgUrl
                                ? `${chatDto?.imgUrl}` //TODO: zpewnic porpawne wyswietlanie zdjecia profilowego
                                : "/users/default.png"
                        }
                        alt={"Image that listed chat has"}
                    />
                    <p className="max-w-[22rem] truncate text-lg font-semibold text-white">
                        {chatDto?.name}
                    </p>
                </button>
            ) : (
                <div className="group relative">
                    <button
                        type="button"
                        className="flex min-w-0 items-center gap-3 rounded-xl p-3 hover:cursor-pointer hover:bg-purple-400/20 focus:ring-2 focus:ring-purple-400/50 focus:outline-none"
                        aria-describedby="chat-tooltip"
                        onClick={handleGroupChatNameClick}
                    >
                        <img
                            className="aspect-square w-9 rounded-full"
                            src={
                                chatDto?.imgUrl
                                    ? `${chatDto.imgUrl}`
                                    : "/users/default.png"
                            }
                            alt="Awatar czatu"
                        />

                        <p className="max-w-[22rem] flex-1 truncate text-lg font-semibold text-white">
                            {chatDto?.name}
                        </p>

                        <MdEdit
                            className="shrink-0 text-white/80 opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
                            aria-hidden="true"
                        />
                    </button>

                    <div
                        id="chat-tooltip"
                        role="tooltip"
                        className="bg-violetLightDarker text-md pointer-events-none absolute top-full left-1/2 z-10 mt-2 min-w-20 -translate-x-1/2 translate-y-1 rounded-md p-2 text-center text-white opacity-0 shadow-lg transition-all duration-150 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                        Edit Chat
                        <div className="bg-violetLightDarker absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45" />
                    </div>
                </div>
            )}

            {chatDto.chatType === "PRIVATE" && (
                <div className="flex items-center justify-center">
                    <HiUserAdd
                        size={30}
                        className="mr-2 hover:cursor-pointer"
                        onClick={handleOpenCreateGroupChatModal}
                    />
                </div>
            )}

            {chatDto.chatType === "GROUP" && (
                <div className="flex items-center justify-center">
                    <FaUsers
                        size={30}
                        className="mr-4 hover:cursor-pointer"
                        onClick={handleOpenSidebar}
                    />
                    <HiUserAdd
                        size={30}
                        className="mr-2 hover:cursor-pointer"
                        onClick={handleOpenAddPeopleToGroupChatModal}
                    />
                </div>
            )}

            <EmptyModal
                onClose={closeGroup}
                isOpen={isOpenGroup}
                className="overflow-y-hidden"
            >
                <EditGroupChatModal onClose={closeGroup} chatDto={chatDto} />
            </EmptyModal>

            <EmptyModal
                onClose={close}
                isOpen={isOpen}
                className="h-3/4 w-3/4 overflow-y-hidden"
            >
                <CreateGroupChatModal onClose={close} />
            </EmptyModal>
            <EmptyModal
                onClose={closeAdd}
                isOpen={isOpenAdd}
                className="h-3/4 w-3/4 overflow-y-hidden"
            >
                <AddPeopleToGroupChatModal
                    chatId={chatDto.id}
                    onClose={closeAdd}
                />
            </EmptyModal>
        </div>
    );
}
