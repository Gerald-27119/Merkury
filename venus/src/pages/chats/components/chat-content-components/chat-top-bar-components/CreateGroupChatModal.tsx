import { FaX } from "react-icons/fa6";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import useDebounce from "../../../../../hooks/useDebounce";
import { SocialListType } from "../../../../../model/enum/account/social/socialListType";
import { searchUsersByUsername } from "../../../../../http/user-dashboard";
import SocialCardList from "../../../../account/social/components/SocialCardList";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import { chatActions } from "../../../../../redux/chats";
import useDispatchTyped from "../../../../../hooks/useDispatchTyped";
import { createGroupChat } from "../../../../../http/chats";
import { useNavigate } from "react-router-dom";

interface SearchFriendsListProps {
    onClose?: () => void;
}

export default function CreateGroupChatModal({
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
        const el = loadMoreRef.current;

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

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleChangeQuery = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const usersToAddToChat = useSelectorTyped(
        (state) => state.chats.usersToAddToChat,
    );
    const selectedSet = useMemo(
        () => new Set(usersToAddToChat),
        [usersToAddToChat],
    );
    const maxReached = usersToAddToChat.length >= 6;

    function handleCloseModal() {
        dispatch(chatActions.clearUsersToAddToChat());
        onClose?.();
    }

    const { mutateAsync: mutateCreateGroupChat, isPending: isCreating } =
        useMutation({
            mutationFn: () => createGroupChat(usersToAddToChat),
            onSuccess: (chat) => {
                dispatch(chatActions.upsertChats([chat]));
                dispatch(chatActions.setSelectedChatId(chat.id));
                dispatch(chatActions.clearNew(chat.id));
                dispatch(chatActions.clearUsersToAddToChat());
                onClose?.();
                navigate("/chat");
            },
        });

    const isCreateDisabled = usersToAddToChat.length === 0 || isCreating;

    async function handleCreateChat() {
        if (!isCreateDisabled) {
            await mutateCreateGroupChat();
        }
    }

    return (
        <div className="relative flex flex-col items-center gap-y-6">
            <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 cursor-pointer"
            >
                <FaX className="text-2xl hover:text-red-600" />
            </button>

            <div className="text-center">
                <h1 className="text-2xl font-semibold">Choose Users</h1>
                <span className="text-sm font-light">
                    There is a limit of 6
                </span>
            </div>

            <div className="flex w-full max-w-xl items-center gap-4">
                <input
                    onChange={handleChangeQuery}
                    value={query}
                    placeholder="Search user"
                    className="bg-lightBgMuted dark:bg-darkBgMuted w-full rounded-md px-2 py-1.5 shadow-md ring-0 outline-0 dark:shadow-black"
                />
                <button
                    className={`w-30 rounded-md bg-green-600 p-2 text-white ${
                        isCreateDisabled
                            ? "cursor-default opacity-40"
                            : "cursor-pointer hover:opacity-80"
                    }`}
                    onClick={handleCreateChat}
                    disabled={isCreateDisabled}
                >
                    {isCreating ? "Creating..." : "Create Chat"}
                </button>
            </div>

            <div className="mt-2 mb-3 flex h-16 flex-wrap gap-3 p-2">
                {usersToAddToChat.map((username) => (
                    <UserToAddButton username={username} key={username} />
                ))}
            </div>

            <SocialCardList
                list={allItems}
                type={SocialListType.POTENTIAL_GROUP_CHAT_MEMBER}
                isSocialForViewer={false}
                isSearchFriend
                selectedUsernames={selectedSet}
                maxReached={maxReached}
                onAddToGroup={(u: string) =>
                    dispatch(chatActions.addUserToAddToChat(u))
                }
            />

            <div ref={loadMoreRef} className="h-10" />

            {(isFetchingNextPage || isLoading) && <LoadingSpinner />}
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
            <span>{username}</span>
            <span
                aria-hidden="true"
                className="text-xl leading-none text-gray-200"
            >
                ×
            </span>
        </button>
    );
}
