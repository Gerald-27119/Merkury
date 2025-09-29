import { useInfiniteQuery } from "@tanstack/react-query";
import Error from "../../components/error/Error.jsx";
import { fetchPaginatedPosts } from "../../http/posts";
import React, { useEffect, useRef, useState } from "react";
import ForumPostPage from "../../model/interface/forum/forumPostPage";
import { ForumPostSortOption } from "../../model/enum/forum/forumPostSortOption";
import ForumPostList from "./components/ForumPostList";
import ForumLayout from "./components/ForumLayout";
import SkeletonListedForumPost from "./components/SkeletonListedForumPost";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner";

export default function Forum() {
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const [sortOption, setSortOption] = useState<ForumPostSortOption>({
        name: "Newest",
        sortBy: "PUBLISH_DATE",
        sortDirection: "DESC",
    });

    const {
        data: postPage,
        error: postPageError,
        isError: isPostPageError,
        isLoading: isPostPageLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<ForumPostPage>({
        queryKey: ["posts", sortOption],
        queryFn: ({ pageParam }) =>
            fetchPaginatedPosts(pageParam as number, 10, sortOption),
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

    const posts = postPage?.pages.flatMap(
        (page: ForumPostPage) => page.content ?? [],
    );

    if (isPostPageLoading) {
        return (
            <ForumLayout>
                <div className="mt-14 min-w-2xl">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <SkeletonListedForumPost key={i} />
                    ))}
                </div>
            </ForumLayout>
        );
    }

    if (isPostPageError) {
        return <Error error={postPageError} />;
    }

    return (
        <ForumLayout>
            <ForumPostList
                posts={posts}
                sortOption={sortOption}
                onSortChange={setSortOption}
            />
            <div ref={loadMoreRef} className="flex items-center justify-center">
                {isFetchingNextPage && <LoadingSpinner />}
                {!hasNextPage && (
                    <p className="pb-4 font-bold">
                        Congratulations! You've reached the end!
                    </p>
                )}
            </div>
        </ForumLayout>
    );
}
