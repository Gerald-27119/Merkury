import ChatList from "./components/ChatList";
import ChatContent from "./components/ChatContent";
import { LuMessageSquarePlus } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { DetailedChatDto } from "../../model/interface/chat/chatInterfaces";
import { useEffect } from "react";
import { chatActions, ChatDto, selectChatById } from "../../redux/chats";
import useSelectorTyped from "../../hooks/useSelectorTyped";
import useDispatchTyped from "../../hooks/useDispatchTyped";

export default function ChatsPage() {
    const dispatch = useDispatchTyped();
    const selectedChatId: number = useSelectorTyped(
        (state) => state?.chats?.selectedChatId,
    ); //TODO:change chat to chatActions

    // const { data, isSuccess } = useQuery<DetailedChatDto, Error>({
    //     queryFn: () => getDetailedChat(selectedChatId, 1),
    //     queryKey: ["detailedChat", selectedChatId],
    // });

    // useEffect(() => {
    //     if (isSuccess && data) {
    //         dispatch(chatActions.addDetailedChatDtos([data]));
    //     }
    // }, [isSuccess, data, dispatch]);

    /**
     * This query fetches a page of chats for a specific user returns the chat with all its messages and participants.
     * As of 03.07.2025, backend returns last 20 messages for each chat.
     * @author Adam Langmesser
     */
    // const {
    //     data: chatsWithMessages,
    //     isSuccess: isChatsWithMessagesFetchSuccessfull,
    // } = useQuery<ChatDto>({
    //     queryFn: () => selectChatById(selectedChatId),
    //     queryKey: ["chat", selectedChatId],
    // });

    // TODO: optimize renders using this tool
    return (
        <div className="flex h-screen w-full">
            <div className="border-violetLight flex w-1/6 flex-col border-l">
                <div className="bg-violetDark border-violetLight flex items-center justify-end gap-20 border-b py-5 text-center font-medium text-white md:text-lg">
                    {/*  TODO: move both friends and new message to the sidebar, only leave text: Chats: ?*/}
                    {/*  TODO: work on responsiveness*/}
                    <h2>Friends</h2>
                    <LuMessageSquarePlus size={30} className="mr-5" />
                </div>

                <div className="scrollbar-track-violetDark/10 hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin bg-violetDark/80 min-w-0 flex-col overflow-y-auto text-white">
                    <ChatList />
                </div>
            </div>

            <div className="bg-violetDark/96 min-w-0 flex-1 text-white">
                <ChatContent />
            </div>
        </div>
    );
}
