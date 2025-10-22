import { ChatParticipantDto } from "../../../../model/interface/chat/chatInterfaces";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { formatMessageLength, formatSentAt } from "../../../../utils/chat";
import { useNavigate } from "react-router-dom";

export default function GroupChatParticipantsSideBar() {
    const navigate = useNavigate();
    const selectedChatId = useSelectorTyped(
        (state) => state.chats.selectedChatId,
    );
    const selectedChat = useSelectorTyped(
        (state) => state.chats.entities[selectedChatId!],
    );

    function handleParticipantClick(username: string) {
        navigate(`/account/profile/${username}`);
    }

    return (
        <aside className="bg-violetDark/80 flex h-full flex-col p-3 text-white">
            <p className="text-md mt-1 mb-1 ml-2 font-semibold text-white">
                Chat Participants - {selectedChat?.participants?.length}
            </p>
            <div className="scrollbar-track-violetDark/10 hover:scrollbar-thumb-violetLight scrollbar-thumb-rounded-full scrollbar-thin bg-violetDark/80 flex h-full w-full min-w-0 grow flex-col gap-1 overflow-y-auto">
                {selectedChat?.participants?.map((participant) => (
                    <button
                        className={`hover:bg-violetLight flex w-full items-center gap-4 px-2 py-3 text-left hover:cursor-pointer`}
                        onClick={() =>
                            handleParticipantClick(participant.username)
                        }
                    >
                        <img
                            className="aspect-square w-12 rounded-full"
                            src={
                                participant?.imgUrl
                                    ? `${participant?.imgUrl}`
                                    : "/users/default.png"
                            } // //TODO: zpewnic porpawne wyswietlanie zdjecia profilowego
                            alt={participant.username}
                        />
                        <div className="flex w-full min-w-0 flex-col">
                            <p className="max-w-80 truncate text-lg font-medium">
                                {participant?.username}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    );
}
