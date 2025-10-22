import { FaX } from "react-icons/fa6";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import useDebounce from "../../../../../hooks/useDebounce";
import { SocialListType } from "../../../../../model/enum/account/social/socialListType";
import { searchUsersByUsername } from "../../../../../http/user-dashboard";
import SocialCardList from "../../../../account/social/components/SocialCardList";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import { chatActions } from "../../../../../redux/chats";
import useDispatchTyped from "../../../../../hooks/useDispatchTyped";
import {
    createGroupChat,
    getOrCreatePrivateChat,
} from "../../../../../http/chats";
import { useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";

interface SearchFriendsListProps {
    onClose?: () => void;
}

export default function AddPeopleToGroupChatModal({
    onClose,
}: SearchFriendsListProps) {
    const [query, setQuery] = useState("");
    const queryDebounced = useDebounce(query, 500);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useDispatchTyped();
    const navigate = useNavigate();

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["friends", SocialListType.FRIENDS, queryDebounced],
            queryFn: ({ pageParam = 0 }) =>
                searchUsersByUsername(queryDebounced, pageParam, 12),
            getNextPageParam: (lastPage, allPages) =>
                lastPage.hasNext ? allPages.length : undefined,
            initialPageParam: 0,
        });

    const allItems = data?.pages.flatMap((page) => page.items);

    useEffect(() => {
        if (!loadMoreRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 },
        );
        observer.observe(loadMoreRef.current);
        return () => {
            observer.disconnect();
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleChangeQuery = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const usersToAddToChat = useSelectorTyped(
        (state) => state.chats.usersToAddToChat,
    );

    function handleCloseModal() {
        dispatch(chatActions.clearUsersToAddToChat());
        if (onClose) {
            onClose();
        }
    }

    async function handleCreateChat() {
        await mutateCreateGroupChat();
    }

    const { mutateAsync: mutateCreateGroupChat } = useMutation({
        mutationFn: () => createGroupChat(usersToAddToChat), //TODO: dodaj jeszcze userow z obecnei otawrtego cahtu
        onSuccess: (chat) => {
            dispatch(chatActions.upsertChats([chat]));
            dispatch(chatActions.setSelectedChatId(chat.id));
            dispatch(chatActions.clearNew(chat.id));
            dispatch(chatActions.clearUsersToAddToChat());
            if (onClose) {
                onClose();
            }
            navigate("/chat");
        },
    });

    const isNotAtLeastOneUserSelected =
        useSelectorTyped((state) => state.chats.usersToAddToChat.length) == 0;

    return (
        <div className="relative flex flex-col items-center gap-y-6">
            <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 cursor-pointer"
            >
                <FaX className="text-2xl hover:text-red-600" />
            </button>
            <div className="text-center">
                <h1 className="text-center text-2xl font-semibold">
                    Choose Users
                </h1>
                <span className="text-center text-sm font-light">
                    There is a limit of 6
                </span>
            </div>
            <div className="flex gap-4">
                <input
                    onChange={handleChangeQuery}
                    value={query}
                    placeholder="Search user"
                    className="dark:bg-darkBgMuted bg-lightBgMuted w-full rounded-md px-2 py-1.5 shadow-md ring-0 outline-0 sm:w-96 dark:shadow-black"
                />

                <button
                    className={`rounded-md bg-green-600 p-2 ${
                        isNotAtLeastOneUserSelected
                            ? "cursor-default opacity-40"
                            : "cursor-pointer hover:opacity-60"
                    }`}
                    onClick={handleCreateChat}
                    disabled={isNotAtLeastOneUserSelected}
                >
                    Create group Chat
                </button>
            </div>

            <div className="mt-2 mb-3 flex h-16 gap-3 p-2">
                {usersToAddToChat.map((username) => (
                    <UserToAddButton username={username} />
                ))}
            </div>

            <SocialCardList
                list={allItems}
                type={SocialListType.POTENTIAL_GROUP_CHAT_MEMBER}
                isSocialForViewer={false}
                isSearchFriend
            />
            <div ref={loadMoreRef} className="h-10" />
            {isFetchingNextPage || (isLoading && <LoadingSpinner />)}
        </div>
    );
}

interface UserToAddProps {
    username: string;
}

function UserToAddButton({ username }: UserToAddProps) {
    const dispatch = useDispatchTyped();

    function remove() {
        dispatch(chatActions.removeUserToAddToChat(username));
    }

    return (
        <button
            type="button"
            onClick={remove}
            className="bg-violetLight inline-flex items-center justify-center gap-1 rounded-md px-3 py-2 text-xl text-white hover:cursor-pointer hover:opacity-60"
            title={`Remove ${username}`}
        >
            <span className="">{username}</span>
            <span
                aria-hidden="true"
                className="text-xl leading-none text-gray-200"
            >
                ×
            </span>
        </button>
    );
}
