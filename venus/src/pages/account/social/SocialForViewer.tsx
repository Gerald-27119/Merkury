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
import { SocialPageDto } from "../../../model/interface/account/social/socialPageDto";

const queryConfigMap: Record<
    SocialListType,
    {
        key: string;
        fn: (
            username: string,
            page: number,
            size: number,
        ) => Promise<SocialPageDto>;
    }
> = {
    [SocialListType.FRIENDS]: {
        key: "friends",
        fn: getUserFriendsForViewer,
    },
    [SocialListType.FOLLOWED]: {
        key: "followed",
        fn: getUserFollowedForViewer,
    },
    [SocialListType.FOLLOWERS]: {
        key: "followers",
        fn: getUserFollowersForViewer,
    },
    [SocialListType.PHOTOS]: {
        key: "photos",
        fn: getUserFollowersForViewer,
    },
};

export default function SocialForViewer() {
    const { username } = useParams();
    const type = useSelectorTyped((state) => state.social.type);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const { key, fn } = queryConfigMap[type];

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryFn: ({ pageParam = 0 }) => fn(username!, pageParam, 12),
            queryKey: [key, username],
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

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <Social
            list={allItems ?? []}
            isSocialForViewer={true}
            loadMoreRef={loadMoreRef}
            isFetchingNextPage={isFetchingNextPage}
            type={type}
        />
    );
}
