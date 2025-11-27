import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ForumPostPage from "../../model/interface/forum/forumPostPage";
import { fetchFollowedPosts } from "../../http/posts";
import { PostSortOption } from "../../model/enum/forum/postSortOption";
import SkeletonListedForumPost from "./components/SkeletonListedForumPost";
import Error from "../../components/error/Error";
import ForumPostsPage from "./ForumPostsPage";
import LoadingState from "../../model/interface/forum/loadingState";

export default function ForumFollowed() {
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const [sortOption, setSortOption] = useState<PostSortOption>({
        name: "Newest",
        sortBy: "PUBLISH_DATE",
        sortDirection: "DESC",
    });

    const {
        data,
        error,
        isError,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<ForumPostPage>({
        queryKey: ["followedPosts", sortOption],
        queryFn: ({ pageParam }) =>
            fetchFollowedPosts(pageParam as number, 10, sortOption),
        getNextPageParam: (lastPage: ForumPostPage) => {
            const { number, totalPages } = lastPage.page;
            return number + 1 < totalPages ? number + 1 : undefined;
        },
        initialPageParam: 0,
    });

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target || !hasNextPage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { rootMargin: "50px", threshold: 0 },
        );
        observer.observe(target);
        return () => {
            observer.disconnect();
        };
    }, [hasNextPage, fetchNextPage, sortOption, isFetchingNextPage]);

    const posts = data?.pages.flatMap(
        (page: ForumPostPage) => page.content ?? [],
    );

    const loadingState: LoadingState = {
        isFetchingNextPage,
        hasNextPage,
        loadMoreRef,
        message: "Congratulations! You've reached the end!",
    };

    if (isLoading) {
        return (
            <div className="w-md md:w-2xl">
                <h1 className="mb-5 text-3xl font-bold">Followed posts</h1>
                {Array.from({ length: 10 }).map((_, i) => (
                    <SkeletonListedForumPost key={i} />
                ))}
            </div>
        );
    }

    if (isError) {
        return <Error error={error} />;
    }

    return (
        <div>
            <h1 className="mb-5 text-3xl font-bold">Followed posts</h1>
            <ForumPostsPage
                posts={posts}
                sortOption={sortOption}
                onSortChange={setSortOption}
                loadingState={loadingState}
            />
        </div>
    );
}
