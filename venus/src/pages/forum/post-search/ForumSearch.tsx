import { useInfiniteQuery } from "@tanstack/react-query";
import ForumPostPage from "../../../model/interface/forum/forumPostPage";
import { fetchSearchedPosts } from "../../../http/posts";
import React, { useEffect, useRef, useState } from "react";
import { PostSortOption } from "../../../model/enum/forum/postSortOption";
import ForumLayout from "../ForumLayout";
import { useSearchParams } from "react-router-dom";
import ForumPostsPage from "../ForumPostsPage";
import LoadingState from "../../../model/interface/forum/loadingState";
import Error from "../../../components/error/Error";
import SkeletonListedForumPost from "../components/SkeletonListedForumPost";

export default function ForumSearch() {
    const [params] = useSearchParams();
    const phrase = params.get("q") ?? "";
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const [sortOption, setSortOption] = useState<PostSortOption>({
        name: "Newest",
        sortBy: "PUBLISH_DATE",
        sortDirection: "DESC",
    });

    const {
        data: searchPostPage,
        error: searchPostPageError,
        isError: isSearchPostPageError,
        isLoading: isSearchPostPageLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<ForumPostPage>({
        queryKey: ["searchedPosts", sortOption, phrase],
        queryFn: ({ pageParam }) =>
            fetchSearchedPosts(pageParam as number, 10, phrase, sortOption),
        getNextPageParam: (lastPage: ForumPostPage) => {
            const { number, totalPages } = lastPage.page;
            return number + 1 < totalPages ? number + 1 : undefined;
        },
        initialPageParam: 0,
        enabled: phrase.trim().length > 0,
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
        message: "No more results found.",
    };

    const posts = searchPostPage?.pages.flatMap(
        (page: ForumPostPage) => page.content ?? [],
    );

    if (isSearchPostPageLoading) {
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

    if (isSearchPostPageError) {
        return <Error error={searchPostPageError} />;
    }

    return (
        <ForumLayout>
            <ForumPostsPage
                posts={posts}
                sortOption={sortOption}
                onSortChange={setSortOption}
                loadingState={loadingState}
                searchPhrase={phrase}
                totalSearchResults={
                    searchPostPage?.pages?.[0]?.page.totalElements ?? 0
                }
            />
        </ForumLayout>
    );
}
