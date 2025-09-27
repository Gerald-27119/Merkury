import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Error from "../../components/error/Error.jsx";
import { fetchPaginatedPosts, fetchCategoriesAndTags } from "../../http/posts";
import React, { useEffect, useRef, useState } from "react";
import AddPostButton from "./components/AddPostButton";
import ForumSearchBar from "./components/ForumSearchBar";
import ForumCategoriesTagsPanel from "./categories-and-tags/ForumCategoriesTagsPanel";
import RightPanel from "./components/RightPanel";
import ForumFormModal from "./components/ForumFormModal";
import { useBoolean } from "../../hooks/useBoolean";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { notificationAction } from "../../redux/notification";
import ForumPostPage from "../../model/interface/forum/forumPostPage";
import useDispatchTyped from "../../hooks/useDispatchTyped";
import { ForumPostSortOption } from "../../model/enum/forum/forumPostSortOption";
import ForumPostList from "./components/ForumPostList";

export default function Forum() {
    const isLogged = useSelector((state: RootState) => state.account.isLogged);
    const dispatch = useDispatchTyped();
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const [sortOption, setSortOption] = useState<ForumPostSortOption>({
        name: "Newest",
        sortBy: "PUBLISH_DATE",
        sortDirection: "DESC",
    });
    const [isModalOpen, setIsModalOpenToTrue, setIsModalOpenToFalse] =
        useBoolean(false);

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

    const {
        data: categoriesAndTags,
        isLoading: isCatTagsLoading,
        isError: isCatTagsError,
        error: catTagsError,
    } = useQuery({
        queryKey: ["categoriesAndTags"],
        queryFn: () => fetchCategoriesAndTags(),
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

    const handleAddPostClick = () => {
        if (isLogged) {
            setIsModalOpenToTrue();
        } else {
            dispatch(
                notificationAction.addInfo({
                    message: "Login to create posts.",
                }),
            );
        }
    };

    if (isPostPageError) {
        return <Error error={postPageError} />;
    }

    const posts = postPage?.pages.flatMap(
        (page: ForumPostPage) => page.content ?? [],
    );

    return (
        <>
            <div className="dark:bg-darkBg dark:text-darkText text-lightText bg-lightBg min-h-screen w-full">
                <div className="mx-auto flex w-full max-w-6xl flex-row gap-4">
                    <div className="sticky-forum-panel">
                        <AddPostButton onClick={handleAddPostClick} />

                        <ForumCategoriesTagsPanel
                            data={categoriesAndTags}
                            isLoading={isCatTagsLoading}
                            isError={isCatTagsError}
                            error={catTagsError}
                        />
                    </div>

                    <ForumPostList
                        posts={posts}
                        sortOption={sortOption}
                        onSortChange={setSortOption}
                        loadMoreRef={loadMoreRef}
                        isFetchingNextPage={isFetchingNextPage}
                    />

                    <div className="sticky-forum-panel">
                        <ForumSearchBar />
                        <RightPanel />
                    </div>
                    <ForumFormModal
                        onClose={setIsModalOpenToFalse}
                        isOpen={isModalOpen}
                        categories={categoriesAndTags?.categories ?? []}
                        tags={categoriesAndTags?.tags ?? []}
                    />
                </div>
            </div>
        </>
    );
}
