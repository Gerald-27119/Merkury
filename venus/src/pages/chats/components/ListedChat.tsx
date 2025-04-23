import { ListedChatDto } from "../chatMockData";
import { formatMessageLength, formatSentAt } from "../../../utils/chat";

export interface ListedChatProps {
  listedChatDto: ListedChatDto;
}

export default function ListedChat({ listedChatDto }: ListedChatProps) {
  return (
    <div className="flex items-center gap-4 px-3 py-3">
      {/*<img*/}
      {/*  className="aspect-square w-12 rounded-full"*/}
      {/*  src={listedChatDto.imgUrl}*/}
      {/*  alt={"Image that listed chat has"}*/}
      {/*/>*/}
      <div className="flex flex-col">
        <p className="text-lg font-medium">{listedChatDto.name}</p>
        <div className="flex gap-2 pr-3 text-sm text-nowrap text-gray-400">
          {listedChatDto.lastMessageDto && (
            <>
              <p className="font-semibold">
                {listedChatDto.lastMessageDto.sender}:
              </p>
              <p>
                {formatMessageLength(
                  listedChatDto.lastMessageDto.message ?? "",
                )}
              </p>
              <p className="text-xs text-gray-400">
                {formatSentAt(listedChatDto.lastMessageDto.sentAt)}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
