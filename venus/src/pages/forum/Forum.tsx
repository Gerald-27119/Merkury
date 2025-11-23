import { useInfiniteQuery } from "@tanstack/react-query";
import Error from "../../components/error/Error.jsx";
import { fetchPaginatedPosts } from "../../http/posts";
import React, { useEffect, useRef, useState } from "react";
import ForumPostPage from "../../model/interface/forum/forumPostPage";
import { PostSortOption } from "../../model/enum/forum/postSortOption";
import ForumLayout from "./ForumLayout";
import SkeletonListedForumPost from "./components/SkeletonListedForumPost";
import LoadingState from "../../model/interface/forum/loadingState";
import ForumPostsPage from "./ForumPostsPage";

export default function Forum() {
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const [sortOption, setSortOption] = useState<PostSortOption>({
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

    const loadingState: LoadingState = {
        isFetchingNextPage,
        hasNextPage,
        loadMoreRef,
        message: "Congratulations! You've reached the end!",
    };

    const posts = postPage?.pages.flatMap(
        (page: ForumPostPage) => page.content ?? [],
    );

    if (isPostPageLoading) {
        return (
            <ForumLayout>
                <div className="mt-14 w-md md:w-2xl">
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
            <ForumPostsPage
                posts={posts}
                sortOption={sortOption}
                onSortChange={setSortOption}
                loadingState={loadingState}
            />
        </ForumLayout>
    );
}
