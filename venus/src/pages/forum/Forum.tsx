import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Error from "../../components/error/Error.jsx";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner.jsx";
import { fetchPaginatedPosts, fetchCategoriesAndTags } from "../../http/posts";
import React, { useEffect, useRef, useState } from "react";
import Post from "./posts/Post";
import AddPostButton from "./components/AddPostButton";
import ForumSearchBar from "./components/ForumSearchBar";
import ForumCategoriesTagsPanel from "./categories-and-tags/ForumCategoriesTagsPanel";
import RightPanel from "./components/RightPanel";
import ForumFormModal from "./components/ForumFormModal";
import { useBoolean } from "../../hooks/useBoolean";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { notificationAction } from "../../redux/notification";
import ForumPostPage from "../../model/interface/forum/forumPostPage";

export default function Forum() {
    const [isModalOpen, setIsModalOpenToTrue, setIsModalOpenToFalse] =
        useBoolean(false);
    const isLogged = useSelector((state: RootState) => state.account.isLogged);
    const dispatch = useDispatch();
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const {
        data: postPage,
        error: postPageError,
        isError: isPostPageError,
        isLoading: isPostPageLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<ForumPostPage>({
        queryKey: ["posts"],
        queryFn: ({ pageParam }) => fetchPaginatedPosts(pageParam as number),
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
                if (entry.isIntersecting) {
                    observer.unobserve(target);
                    fetchNextPage();
                }
            },
            { rootMargin: "5px", threshold: 0 },
        );
        observer.observe(target);
    }, [hasNextPage, fetchNextPage]);

    if (isPostPageError) {
        return <Error error={postPageError} />;
    }

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

    const posts = postPage?.pages.flatMap((page) => page.content ?? []);

    return (
        <>
            <div className="dark:bg-darkBg dark:text-darkText text-lightText bg-lightBg min-h-screen w-full">
                <div className="mx-auto mt-8 flex w-full max-w-6xl flex-row gap-4">
                    <div>
                        <AddPostButton onClick={handleAddPostClick} />

                        <ForumCategoriesTagsPanel
                            data={categoriesAndTags}
                            isLoading={isCatTagsLoading}
                            isError={isCatTagsError}
                            error={catTagsError}
                        />
                    </div>

                    <div className="mt-10">
                        {posts?.length ? (
                            <div>
                                <ul>
                                    {posts.map((post) => (
                                        <li key={post.id}>
                                            <Post post={post} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <span>No posts available</span>
                        )}
                        <div ref={loadMoreRef}>
                            {isFetchingNextPage && <LoadingSpinner />}
                        </div>
                    </div>

                    <div>
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
