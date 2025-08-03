import {
    ChatDto,
    ChatMessageDto,
    ChatMessagesPageDto,
} from "../../../../model/interface/chat/chatInterfaces";
import ChatMessage from "./ChatMessage";
import { format } from "date-fns";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessagesForChat } from "../../../../http/chats";
import { useEffect } from "react";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { chatActions } from "../../../../redux/chats";
import { FixedSizeList as List } from "react-window";

interface ChatMessagingWindowProps {
    chatDto: ChatDto;
}

export default function ChatMessagingWindow({
    chatDto,
}: ChatMessagingWindowProps) {
    const messages = chatDto?.messages ?? [];
    const dispatch = useDispatchTyped();
    const { ref: trackedDivRef, inView: isTrackedDivInView } = useInView();

    //TODO: na pewno query key jest git?
    // Yes. I recommend using the react-window-infinite-loader package:, https://www.npmjs.com/package/react-window
    const {
        data: chatMessagesPageDto,
        fetchNextPage,
        isFetchingNextPage,
        isSuccess,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["messages", chatDto?.id],
        queryFn: ({ pageParam = 1 }) =>
            getMessagesForChat(chatDto?.id, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.hasNextSlice ? lastPage.sliceNumber + 1 : undefined,
    });

    useEffect(() => {
        if (isTrackedDivInView && hasNextPage) {
            fetchNextPage();
        }
    }, [isTrackedDivInView]);

    useEffect(() => {
        if (isSuccess && chatMessagesPageDto) {
            const newMessages: ChatMessageDto[] =
                chatMessagesPageDto.pages.flatMap((page) => page.messages);
            dispatch(
                chatActions.addMessages({
                    chatId: chatDto.id,
                    messages: newMessages,
                }),
            );
        }
    }, [isSuccess, chatMessagesPageDto]);

    // TODO: wirtualizacja listy, cahcowanie wiadomosci, aby nie po kazdym odswiezaeniu? pobranie w tle nowych?
    // TODO: dlaczego mam powtorki niektorych messagow?

    return (
        <div className="scrollbar-track-violetDark scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin bg-violetDark/20 flex h-full flex-col-reverse overflow-y-scroll py-1">
            {messages.length === 0 && (
                <p className="mt-auto px-4 py-1 font-light">
                    It's the beginning of the conversation
                </p>
            )}
            {
                // <List>
                //
                // </List>
                messages.map((message: ChatMessageDto, idx: number) => {
                    const thisDate = new Date(message.sentAt).toDateString();
                    // poprzednia wiadomość w oryginalnej kolejności (nie reverse)
                    const prevMessage = messages[idx + 1];
                    const prevDate =
                        prevMessage &&
                        new Date(prevMessage.sentAt).toDateString();

                    // TODO:useMemo?
                    const shouldGroupMessagesByTime =
                        checkIfShouldGroupMessagesByTime(message, prevMessage);

                    return (
                        <div
                            key={message.id}
                            className="hover:bg-violetLight/40 pl-2"
                        >
                            {thisDate !== prevDate && (
                                <div className="my-2 flex w-full items-center">
                                    <hr className="flex-grow border-gray-500" />
                                    <span className="px-2 text-xs text-gray-300">
                                        {format(
                                            new Date(message.sentAt),
                                            "PPP",
                                        )}
                                    </span>
                                    <hr className="flex-grow border-gray-500" />
                                </div>
                            )}
                            <ChatMessage
                                message={message}
                                shouldGroupMessagesByTime={
                                    shouldGroupMessagesByTime
                                }
                            />
                        </div>
                    );
                })
            }

            {/*Empty div for observer tracking*/}
            <div ref={trackedDivRef}>
                {isFetchingNextPage && "fetching next page..."}
            </div>
        </div>
    );
}

function checkIfShouldGroupMessagesByTime(
    message: ChatMessageDto,
    prevMessage?: ChatMessageDto,
): boolean {
    if (!prevMessage) return false;

    const current = new Date(message.sentAt);
    const previous = new Date(prevMessage.sentAt);

    if (current.toDateString() !== previous.toDateString()) {
        return false;
    }

    if (message.sender.id !== prevMessage.sender.id) {
        return false;
    }

    const diffMs = Math.abs(current.getTime() - previous.getTime());
    const diffMinutes = diffMs / 1000 / 60;

    return diffMinutes < 2;
}
