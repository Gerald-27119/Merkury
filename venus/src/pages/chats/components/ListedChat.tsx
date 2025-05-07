import { formatMessageLength, formatSentAt } from "../../../utils/chat";
import { SimpleChatDto } from "../../../model/interface/chat/chatInterfaces";
import { memo } from "react";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { chatActions } from "../../../redux/chats";

interface ListedChatProps {
    simpleChatDto: SimpleChatDto;
}

function ListedChat({ simpleChatDto }: ListedChatProps) {
    const dispatch = useDispatchTyped();
    const isSelected =
        simpleChatDto?.id ===
        useSelectorTyped((state) => state.chats.selectedChatId);

    if (!simpleChatDto) {
        return <div>Loading...</div>;
    }

    return (
        <button
            className={`hover:bg-violetLight/40 flex w-full items-center gap-4 px-3 py-3 text-left hover:cursor-pointer ${isSelected && "bg-violetLight/80"}`}
            onClick={() =>
                dispatch(chatActions.setSelectedChatId(simpleChatDto?.id))
            }
        >
            <img
                className="aspect-square w-12 rounded-full"
                src={
                    simpleChatDto?.imgUrl
                        ? // for development purposes
                          `/public/users/${simpleChatDto.imgUrl}`
                        : "/public/users/default.png"
                }
                alt={"Image that listed chat has"}
            />
            <div className="flex flex-col">
                <p className="text-lg font-medium">{simpleChatDto?.name}</p>
                <div className="flex gap-2 pr-3 text-sm text-nowrap text-gray-400">
                    {simpleChatDto.lastMessage && (
                        <>
                            {simpleChatDto.lastMessage?.sender?.name && (
                                <p className="font-semibold">
                                    {simpleChatDto.lastMessage.sender.name}:
                                </p>
                            )}
                            <p>
                                {formatMessageLength(
                                    simpleChatDto.lastMessage.content ?? "",
                                )}
                            </p>
                            <p className="text-xs text-gray-400">
                                {formatSentAt(simpleChatDto.lastMessage.sentAt)}
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
