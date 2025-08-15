import { useInfiniteQuery } from "@tanstack/react-query";
import {
    getUserFollowedForViewer,
    getUserFollowersForViewer,
    getUserFriendsForViewer,
} from "../../../http/user-dashboard";
import Social from "./Social";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import { SocialListType } from "../../../model/enum/account/social/socialListType";
import { useEffect, useRef } from "react";

export default function SocialForViewer() {
    const { username } = useParams();
    const type = useSelectorTyped((state) => state.social.type);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const {
        data: friends,
        isLoading: isLoadingFriends,
        fetchNextPage: fetchNextFriends,
        hasNextPage: hasNextFriends,
        isFetchingNextPage: isFetchingNextFriends,
    } = useInfiniteQuery({
        queryFn: ({ pageParam = 0 }) =>
            getUserFriendsForViewer(username!, pageParam, 12),
        queryKey: ["friends", username],
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
        queryFn: ({ pageParam = 0 }) =>
            getUserFollowedForViewer(username!, pageParam, 12),
        queryKey: ["followed", username],
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
        queryFn: ({ pageParam = 0 }) =>
            getUserFollowersForViewer(username!, pageParam, 12),
        queryKey: ["followers", username],
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
            // TODO Photos będzie robione w innym zadaniu
            photos={[]}
            isSocialForViewer={true}
            loadMoreRef={loadMoreRef}
            isFetchingNextPage={isFetchingNextPage}
        />
    );
}
