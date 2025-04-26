import { formatMessageLength, formatSentAt } from "../../../utils/chat";
import { SimpleChatDto } from "../constants";
import { memo } from "react";

export interface ListedChatProps {
  simpleChatDto: SimpleChatDto;
}

function ListedChat({ simpleChatDto }: ListedChatProps) {
  return (
    <div className="flex items-center gap-4 px-3 py-3">
      <img
        className="aspect-square w-12 rounded-full"
        src={
          simpleChatDto.imgUrl
            ? `/public/users/${simpleChatDto.imgUrl}`
            : "/public/users/default.png"
        }
        alt={"Image that listed chat has"}
      />
      <div className="flex flex-col">
        <p className="text-lg font-medium">{simpleChatDto.name}</p>
        <div className="flex gap-2 pr-3 text-sm text-nowrap text-gray-400">
          {simpleChatDto.lastMessage && (
            <>
              {simpleChatDto.lastMessage?.sender?.name && (
                <p className="font-semibold">
                  {simpleChatDto.lastMessage.sender.name}:
                </p>
              )}
              <p>
                {formatMessageLength(simpleChatDto.lastMessage.content ?? "")}
              </p>
              <p className="text-xs text-gray-400">
                {formatSentAt(simpleChatDto.lastMessage.sentAt)}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ListedChat);
