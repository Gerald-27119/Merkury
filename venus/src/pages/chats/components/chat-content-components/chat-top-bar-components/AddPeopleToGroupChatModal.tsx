import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import useDebounce from "../../../../../hooks/useDebounce";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import useSelectorTyped from "../../../../../hooks/useSelectorTyped";
import { chatActions } from "../../../../../redux/chats";
import useDispatchTyped from "../../../../../hooks/useDispatchTyped";
import {
    addUsersToGroupChat,
    searchPotentialUsersToAddToGroupChat,
} from "../../../../../http/chats";
import { useNavigate } from "react-router-dom";
import { FaX } from "react-icons/fa6";
import { IoAddOutline } from "react-icons/io5";
import { PotentialChatMemberDto } from "../../../../../model/interface/chat/chatInterfaces";

interface AddPeopleToGroupChatModalProps {
    chatId: number;
    onClose?: () => void;
}

export default function AddPeopleToGroupChatModal({
    chatId,
    onClose,
}: AddPeopleToGroupChatModalProps) {
    const MAX_ADD = 7;

    const [query, setQuery] = useState("");
    const queryDebounced = useDebounce(query, 400);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useDispatchTyped();
    const navigate = useNavigate();

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["group-add-search", chatId, queryDebounced],
            queryFn: ({ pageParam = 0 }) =>
                searchPotentialUsersToAddToGroupChat(
                    chatId,
                    queryDebounced,
                    pageParam,
                    20,
                ),
            getNextPageParam: (lastPage, allPages) =>
                lastPage.hasNext ? allPages.length : undefined,
            initialPageParam: 0,
        });

    const allItems: PotentialChatMemberDto[] = useMemo(
        () => data?.pages.flatMap((p) => p.items) ?? [],
        [data],
    );

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

    function handleCloseModal() {
        dispatch(chatActions.clearUsersToAddToChat());
        onClose?.();
    }

    const { mutateAsync: mutateAddUsers, isPending: isAdding } = useMutation({
        mutationFn: () => addUsersToGroupChat(chatId, usersToAddToChat),
        onSuccess: (updatedChat) => {
            dispatch(chatActions.upsertChats([updatedChat]));
            dispatch(chatActions.setSelectedChatId(updatedChat.id));
            dispatch(chatActions.clearNew(updatedChat.id));
            dispatch(chatActions.clearUsersToAddToChat());
            onClose?.();
            navigate("/chat");
        },
    });

    const selectionCount = usersToAddToChat.length;
    const isNoSelection = selectionCount === 0;
    const isLimitReached = selectionCount >= MAX_ADD;

    return (
        <div className="relative flex flex-col items-center gap-y-6">
            <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 cursor-pointer"
                aria-label="Close"
                title="Close"
            >
                <FaX className="text-2xl hover:text-red-600" />
            </button>

            <div className="text-center">
                <h1 className="text-center text-2xl font-semibold">
                    Add people to group
                </h1>
                <span className="text-center text-sm font-light">
                    Max number of users to add is {MAX_ADD}{" "}
                    <span className="ml-2 rounded-md bg-black/10 px-2 py-0.5 text-xs dark:bg-white/10">
                        {selectionCount}/{MAX_ADD}
                    </span>
                </span>
            </div>

            <div className="flex w-full max-w-2xl justify-center gap-4">
                <input
                    onChange={handleChangeQuery}
                    value={query}
                    placeholder="Search user"
                    className="dark:bg-darkBgMuted bg-lightBgMuted w-[30rem] rounded-md px-3 py-2 shadow-md ring-0 outline-0 dark:shadow-black"
                />
                <button
                    className={`rounded-md px-4 py-1 ${
                        isNoSelection || isAdding
                            ? "cursor-not-allowed bg-green-600/40"
                            : "cursor-pointer bg-green-600 hover:opacity-80"
                    }`}
                    onClick={() => mutateAddUsers()}
                    disabled={isNoSelection || isAdding}
                    title={
                        isNoSelection
                            ? "Select at least one user"
                            : "Add selected users"
                    }
                >
                    {isAdding ? "Adding..." : "Add users"}
                </button>
            </div>

            {/* Selected users */}
            <div className="mt-2 mb-3 flex min-h-10 flex-wrap gap-3 p-2">
                {usersToAddToChat.map((username) => (
                    <UserChip key={username} username={username} />
                ))}
                {usersToAddToChat.length === 0 && (
                    <span className="text-sm text-gray-400">
                        No users selected
                    </span>
                )}
            </div>

            {/* Results grid */}
            <div className="w-full max-w-5xl">
                <ResultsGrid
                    items={allItems}
                    selected={new Set(usersToAddToChat)}
                    maxReached={isLimitReached}
                    onToggle={(username) => {
                        const already = usersToAddToChat.includes(username);
                        if (already) {
                            dispatch(
                                chatActions.removeUserToAddToChat(username),
                            );
                        } else {
                            if (isLimitReached) return; // twardy limit 7
                            dispatch(chatActions.addUserToAddToChat(username));
                        }
                    }}
                />

                <div ref={loadMoreRef} className="h-10" />
                {(isFetchingNextPage || isLoading) && <LoadingSpinner />}
                {!isLoading && allItems.length === 0 && (
                    <div className="py-6 text-center text-sm text-gray-400">
                        No results
                    </div>
                )}
            </div>
        </div>
    );
}

function UserChip({ username }: { username: string }) {
    const dispatch = useDispatchTyped();
    return (
        <button
            type="button"
            onClick={() =>
                dispatch(chatActions.removeUserToAddToChat(username))
            }
            className="bg-violetLight inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-white hover:opacity-70"
            title={`Remove ${username}`}
        >
            <span>{username}</span>
            <span aria-hidden className="text-lg leading-none text-gray-200">
                ×
            </span>
        </button>
    );
}

function ResultsGrid({
    items,
    selected,
    maxReached,
    onToggle,
}: {
    items: PotentialChatMemberDto[];
    selected: Set<string>;
    maxReached: boolean;
    onToggle: (username: string) => void;
}) {
    return (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((u) => {
                const isSelected = selected.has(u.username);
                const disabledAdd = !isSelected && maxReached; // gdy osiągnięto limit i ten user nie jest jeszcze wybrany
                return (
                    <li
                        key={u.username}
                        className={[
                            "relative space-y-3 rounded-md px-3 pt-6 pb-4",
                            "bg-lightBgSoft dark:bg-darkBgSoft",
                            "shadow-sm",
                        ].join(" ")}
                    >
                        <div className="flex w-full justify-center">
                            <img
                                src={
                                    u?.profileImg
                                        ? `${u?.profileImg}`
                                        : "/users/default.png"
                                }
                                alt="profileImage"
                                className="h-24 w-24 cursor-pointer rounded-full object-cover shadow-md"
                                onError={(e) => {
                                    (
                                        e.currentTarget as HTMLImageElement
                                    ).style.display = "none";
                                }}
                                title={u.username}
                            />
                        </div>

                        <h3 className="text-center text-xl font-semibold capitalize">
                            {u.username}
                        </h3>

                        <button
                            onClick={() => onToggle(u.username)}
                            className={[
                                "h-12 w-full rounded-md text-white transition",
                                isSelected
                                    ? "cursor-pointer bg-emerald-600 hover:opacity-90"
                                    : disabledAdd
                                      ? "pointer-events-none cursor-not-allowed bg-blue-600/40 opacity-60 saturate-0"
                                      : "cursor-pointer bg-blue-600 hover:opacity-80",
                            ].join(" ")}
                            aria-disabled={disabledAdd}
                            aria-label={
                                isSelected
                                    ? `Remove ${u.username} from selection`
                                    : `Add ${u.username} to selection`
                            }
                            title={
                                isSelected
                                    ? "Click to remove"
                                    : disabledAdd
                                      ? "Selection limit reached (7)"
                                      : "Click to add"
                            }
                        >
                            {isSelected ? (
                                <span className="text-base font-semibold">
                                    Added
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2 text-base font-semibold">
                                    <IoAddOutline
                                        aria-label="addToPotentialGroupChatIcon"
                                        className="text-2xl"
                                    />
                                    Add
                                </span>
                            )}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
