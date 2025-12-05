import { useInfiniteQuery } from "@tanstack/react-query";
import ForumPostPage from "../../../model/interface/forum/forumPostPage";
import { fetchSearchedPosts } from "../../../http/posts";
import React, { useEffect, useRef, useState } from "react";
import { PostSortOption } from "../../../model/enum/forum/postSortOption";
import { useSearchParams } from "react-router-dom";
import ForumPostsPage from "../ForumPostsPage";
import LoadingState from "../../../model/interface/forum/loadingState";
import SkeletonListedForumPost from "../components/SkeletonListedForumPost";
import { PostSearchRequestDto } from "../../../model/interface/forum/post/postSearchRequestDto";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { notificationAction } from "../../../redux/notification";

export default function ForumSearch() {
    const [params] = useSearchParams();
    const dispatch = useDispatchTyped();
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const [sortOption, setSortOption] = useState<PostSortOption>({
        name: "Newest",
        sortBy: "PUBLISH_DATE",
        sortDirection: "DESC",
    });

    const request: PostSearchRequestDto = {
        searchPhrase: params.get("q") ?? "",
        category: params.get("category") ?? "",
        tags: params.getAll("tags"),
        fromDate: params.get("from") ?? "",
        toDate: params.get("to") ?? "",
        author: params.get("author") ?? "",
    };

    const {
        data: searchPostPage,
        error: searchPostPageError,
        isError: isSearchPostPageError,
        isLoading: isSearchPostPageLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<ForumPostPage>({
        queryKey: ["searchedPosts", sortOption, request],
        queryFn: ({ pageParam }) =>
            fetchSearchedPosts(pageParam as number, 10, request, sortOption),
        getNextPageParam: (lastPage: ForumPostPage) => {
            const { number, totalPages } = lastPage.page;
            return number + 1 < totalPages ? number + 1 : undefined;
        },
        initialPageParam: 0,
        retry: false,
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
        message:
            (searchPostPage?.pages?.[0]?.page.totalElements ?? 0) > 0
                ? "No more results found."
                : undefined,
    };

    const posts = searchPostPage?.pages.flatMap(
        (page: ForumPostPage) => page.content ?? [],
    );

    if (isSearchPostPageLoading) {
        return (
            <div className="mt-14 w-md md:w-2xl">
                {Array.from({ length: 10 }).map((_, i) => (
                    <SkeletonListedForumPost key={i} />
                ))}
            </div>
        );
    }

    if (isSearchPostPageError) {
        dispatch(
            notificationAction.addError({
                message: searchPostPageError.message,
            }),
        );
    }

    return (
        <div>
            <h1 className="mb-5 text-3xl font-bold">Search results</h1>
            <ForumPostsPage
                posts={posts}
                sortOption={sortOption}
                onSortChange={setSortOption}
                loadingState={loadingState}
                searchFilters={request}
                totalSearchResults={
                    searchPostPage?.pages?.[0]?.page.totalElements ?? 0
                }
            />
        </div>
    );
}
