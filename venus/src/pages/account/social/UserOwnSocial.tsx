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
import { SocialPageDto } from "../../../model/interface/account/social/socialPageDto";

type SupportedSocialType =
    | SocialListType.FRIENDS
    | SocialListType.FOLLOWED
    | SocialListType.FOLLOWERS;

const queryConfigMap: Record<
    SupportedSocialType,
    { key: string; fn: (page: number, size: number) => Promise<SocialPageDto> }
> = {
    [SocialListType.FRIENDS]: {
        key: "friends",
        fn: getUserOwnFriends,
    },
    [SocialListType.FOLLOWED]: {
        key: "followed",
        fn: getUserOwnFollowed,
    },
    [SocialListType.FOLLOWERS]: {
        key: "followers",
        fn: getUserOwnFollowers,
    },
};

const isSupportedSocialType = (t: SocialListType): t is SupportedSocialType =>
    t === SocialListType.FRIENDS ||
    t === SocialListType.FOLLOWED ||
    t === SocialListType.FOLLOWERS;

export default function UserOwnSocial() {
    const selectedType = useSelectorTyped((state) => state.social.type);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const type = isSupportedSocialType(selectedType)
        ? selectedType
        : SocialListType.FRIENDS;

    const { key, fn } = queryConfigMap[type];

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: [key],
            queryFn: ({ pageParam = 0 }) => fn(pageParam, 12),
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
            isSocialForViewer={false}
            loadMoreRef={loadMoreRef}
            isFetchingNextPage={isFetchingNextPage}
            type={type}
        />
    );
}
