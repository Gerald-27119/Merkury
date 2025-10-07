import SocialCardList from "./SocialCardList";
import { SocialListType } from "../../../../model/enum/account/social/socialListType";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchUsersByUsername } from "../../../../http/user-dashboard";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import useDebounce from "../../../../hooks/useDebounce";
import { FaX } from "react-icons/fa6";

interface SearchFriendsListProps {
    onClose?: () => void;
}

export default function SearchFriendsList({ onClose }: SearchFriendsListProps) {
    const [query, setQuery] = useState("");
    const queryDebounced = useDebounce(query, 500);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

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

    return (
        <div className="relative flex flex-col items-center gap-y-6">
            <button
                onClick={onClose}
                className="absolute top-3 right-3 cursor-pointer"
            >
                <FaX className="transform text-2xl duration-300 hover:text-red-600" />
            </button>
            <h1 className="text-center text-2xl font-semibold">
                Search new Friend
            </h1>
            <div className="flex flex-col gap-y-2">
                <input
                    onChange={handleChangeQuery}
                    value={query}
                    placeholder="Search friends"
                    className="dark:bg-darkBgMuted bg-lightBgSoft w-full rounded-md px-2 py-1.5 shadow-md ring-0 outline-0 sm:w-96 dark:shadow-black"
                />
            </div>
            <SocialCardList
                list={allItems}
                type={SocialListType.FRIENDS}
                isSocialForViewer={false}
                isSearchFriend
            />
            <div ref={loadMoreRef} className="h-10" />
            {isFetchingNextPage || (isLoading && <LoadingSpinner />)}
        </div>
    );
}
