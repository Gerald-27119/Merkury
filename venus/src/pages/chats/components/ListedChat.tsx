import { formatMessageLength, formatSentAt } from "../../../utils/chat";
import { ChatDto } from "../../../model/interface/chat/chatInterfaces";
import { memo } from "react";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { chatActions } from "../../../redux/chats";

interface ListedChatProps {
    chat: ChatDto;
    hasNew?: boolean;
}

function ListedChat({ chat, hasNew }: ListedChatProps) {
    const dispatch = useDispatchTyped();
    const selectedId = useSelectorTyped((s) => s.chats.selectedChatId);
    const isSelected = chat?.id === selectedId;

    if (!chat) return <div>Loading...</div>;

    function handleSelectedChatChange() {
        dispatch(chatActions.setSelectedChatId(chat.id));
        dispatch(chatActions.clearNew(chat.id));
    }

    return (
        <button
            className={`flex w-full items-center gap-4 px-3 py-3 text-left hover:cursor-pointer ${
                isSelected
                    ? "dark:bg-violetLight/80 bg-violetBright/60"
                    : hasNew
                      ? "bg-violetBright/40 dark:bg-violet-300/65"
                      : "hover:dark:bg-violetLight/40 hover:bg-violetBright/20"
            }`}
            onClick={handleSelectedChatChange}
        >
            <img
                className="aspect-square w-12 rounded-full"
                src={chat?.imgUrl ? `${chat?.imgUrl}` : "/users/default.png"}
                alt={chat.imgUrl}
            />
            <div className="flex w-full min-w-0 flex-col">
                <p className="flex-1 truncate text-lg font-medium">
                    {chat?.name}
                </p>
                <div className="flex gap-2 text-sm text-nowrap dark:text-gray-400">
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
                            <p className="ml-auto block text-xs dark:text-gray-400">
                                {formatSentAt(chat.lastMessage.sentAt)}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </button>
    );
}

export default memo(ListedChat);
