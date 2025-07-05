import { formatMessageLength, formatSentAt } from "../../../utils/chat";
import { ChatDto } from "../../../model/interface/chat/chatInterfaces";
import { memo } from "react";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { chatActions } from "../../../redux/chats";

interface ListedChatProps {
    chat: ChatDto;
}

function ListedChat({ chat }: ListedChatProps) {
    const dispatch = useDispatchTyped();
    const isSelected =
        chat?.id === useSelectorTyped((state) => state.chats.selectedChatId);

    if (!chat) {
        return <div>Loading... </div>;
    }

    return (
        <button
            className={`hover:bg-violetLight/40 flex w-full items-center gap-4 px-3 py-3 text-left hover:cursor-pointer ${isSelected && "bg-violetLight/80"}`}
            onClick={() => dispatch(chatActions.setSelectedChatId(chat?.id))}
        >
            <img
                className="aspect-square w-12 rounded-full"
                src={
                    chat?.imgUrl
                        ? // for development purposes
                          `/users/${chat.imgUrl}`
                        : "/users/default.png"
                }
                alt={"Image that listed chat has"}
            />
            <div className="flex w-full flex-col">
                <p className="text-lg font-medium">{chat?.name}</p>
                <div className="flex gap-2 text-sm text-nowrap text-gray-400">
                    {chat.lastMessage && (
                        <>
                            {chat.lastMessage?.sender?.name && (
                                <p className="font-semibold">
                                    {chat.lastMessage.sender.name}:
                                </p>
                            )}
                            <p className="block">
                                {formatMessageLength(
                                    chat.lastMessage.content ?? "",
                                )}
                            </p>
                            <p className="ml-auto block text-xs text-gray-400">
                                {formatSentAt(chat.lastMessage.sentAt)}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </button>
    );
}

//TODO: need to check if it's necessary to use memo here
export default memo(ListedChat);
