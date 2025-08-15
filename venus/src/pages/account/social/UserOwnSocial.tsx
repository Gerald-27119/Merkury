import Social from "./Social";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
    getUserOwnFollowed,
    getUserOwnFollowers,
    getUserOwnFriends,
} from "../../../http/user-dashboard";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import { SocialListType } from "../../../model/enum/account/social/socialListType";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import { useEffect, useRef } from "react";

export default function UserOwnSocial() {
    const type = useSelectorTyped((state) => state.social.type);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const {
        data: friends,
        isLoading: isLoadingFriends,
        fetchNextPage: fetchNextFriends,
        hasNextPage: hasNextFriends,
        isFetchingNextPage: isFetchingNextFriends,
    } = useInfiniteQuery({
        queryFn: ({ pageParam = 0 }) => getUserOwnFriends(pageParam, 12),
        queryKey: ["friends"],
        enabled: type === SocialListType.FRIENDS,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.hasNext ? allPages.length : undefined,
        initialPageParam: 0,
    });

    const {
        data: followed,
        isLoading: isLoadingFollowed,
        fetchNextPage: fetchNextFollowed,
        hasNextPage: hasNextFollowed,
        isFetchingNextPage: isFetchingNextFollowed,
    } = useInfiniteQuery({
        queryKey: ["followed"],
        queryFn: ({ pageParam = 0 }) => getUserOwnFollowed(pageParam, 12),
        enabled: type === SocialListType.FOLLOWED,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.hasNext ? allPages.length : undefined,
        initialPageParam: 0,
    });

    const {
        data: followers,
        isLoading: isLoadingFollowers,
        fetchNextPage: fetchNextFollowers,
        hasNextPage: hasNextFollowers,
        isFetchingNextPage: isFetchingNextFollowers,
    } = useInfiniteQuery({
        queryKey: ["followers"],
        queryFn: ({ pageParam = 0 }) => getUserOwnFollowers(pageParam, 12),
        enabled: type === SocialListType.FOLLOWERS,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.hasNext ? allPages.length : undefined,
        initialPageParam: 0,
    });

    const allFriends = friends?.pages.flatMap((page) => page.items);
    const allFollowed = followed?.pages.flatMap((page) => page.items);
    const allFollowers = followers?.pages.flatMap((page) => page.items);

    const isFetchingNextPage =
        (type === SocialListType.FRIENDS && isFetchingNextFriends) ||
        (type === SocialListType.FOLLOWED && isFetchingNextFollowed) ||
        (type === SocialListType.FOLLOWERS && isFetchingNextFollowers);

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0].isIntersecting) return;

                switch (type) {
                    case SocialListType.FRIENDS:
                        if (hasNextFriends && !isFetchingNextFriends) {
                            fetchNextFriends();
                        }
                        break;
                    case SocialListType.FOLLOWED:
                        if (hasNextFollowed && !isFetchingNextFollowed) {
                            fetchNextFollowed();
                        }
                        break;
                    case SocialListType.FOLLOWERS:
                        if (hasNextFollowers && !isFetchingNextFollowers) {
                            fetchNextFollowers();
                        }
                        break;
                    default:
                        break;
                }
            },
            { threshold: 1.0 },
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [
        type,
        hasNextFriends,
        isFetchingNextFriends,
        fetchNextFriends,
        hasNextFollowed,
        isFetchingNextFollowed,
        fetchNextFollowed,
        hasNextFollowers,
        isFetchingNextFollowers,
        fetchNextFollowers,
    ]);

    if (isLoadingFriends || isLoadingFollowed || isLoadingFollowers) {
        return <LoadingSpinner />;
    }

    return (
        <Social
            friends={allFriends ?? []}
            followed={allFollowed ?? []}
            followers={allFollowers ?? []}
            isSocialForViewer={false}
            loadMoreRef={loadMoreRef}
            isFetchingNextPage={isFetchingNextPage}
        />
    );
}
