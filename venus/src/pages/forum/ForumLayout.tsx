import React, { ReactNode } from "react";
import AddPostButton from "./components/AddPostButton";
import PostCategoriesTagsPanel from "./categories-and-tags/components/PostCategoriesTagsPanel";
import ForumSearchBar from "./post-search/ForumSearchBar";
import TrendingPostsPanel from "./components/TrendingPostsPanel";
import ForumAddPostModal from "./components/ForumAddPostModal";
import { useQuery } from "@tanstack/react-query";
import { fetchCategoriesAndTags, fetchTrendingPosts } from "../../http/posts";
import { notificationAction } from "../../redux/notification";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useDispatchTyped from "../../hooks/useDispatchTyped";
import { forumModalAction } from "../../redux/forumModal";
import ForumReportModal from "./components/ForumReportModal";
import { forumReportModalAction } from "../../redux/forumReportModal";

interface ForumLayoutProps {
    children: ReactNode;
}

export default function ForumLayout({ children }: ForumLayoutProps) {
    const isLogged = useSelector((state: RootState) => state.account.isLogged);
    const dispatch = useDispatchTyped();
    const { isOpen, mode, postToEdit } = useSelector(
        (state: RootState) => state.forum,
    );
    const { isReportOpen, reportTarget } = useSelector(
        (state: RootState) => state.forumReport,
    );

    const {
        data: categoriesAndTags,
        isLoading: isCatTagsLoading,
        isError: isCatTagsError,
        error: catTagsError,
    } = useQuery({
        queryKey: ["categoriesAndTags"],
        queryFn: () => fetchCategoriesAndTags(),
    });

    const {
        data: trendingPosts,
        isLoading: isTrendingPostsLoading,
        isError: isTrendingPostsError,
        error: trendingPostsError,
    } = useQuery({
        queryKey: ["trendingPosts"],
        queryFn: () => fetchTrendingPosts(),
    });

    const handleAddPostClick = () => {
        if (isLogged) {
            dispatch(forumModalAction.openCreateModal());
        } else {
            dispatch(
                notificationAction.addInfo({
                    message: "Login to create posts.",
                }),
            );
        }
    };

    return (
        <div className="dark:bg-darkBg dark:text-darkText text-lightText bg-lightBg min-h-screen w-full">
            <div className="mx-auto mt-16 flex w-full max-w-6xl flex-row gap-4 xl:mt-8">
                <div className="sticky-forum-panel">
                    <AddPostButton onClick={handleAddPostClick} />

                    <PostCategoriesTagsPanel
                        data={categoriesAndTags}
                        isLoading={isCatTagsLoading}
                        isError={isCatTagsError}
                        error={catTagsError}
                    />
                </div>

                <div>{children}</div>

                <div className="sticky-forum-panel w-58">
                    <ForumSearchBar
                        categories={categoriesAndTags?.categories ?? []}
                        tags={categoriesAndTags?.tags ?? []}
                    />
                    <TrendingPostsPanel
                        data={trendingPosts}
                        isLoading={isTrendingPostsLoading}
                        isError={isTrendingPostsError}
                        error={trendingPostsError}
                    />
                </div>
                <ForumAddPostModal
                    onClose={() => dispatch(forumModalAction.closeModal())}
                    isOpen={isOpen}
                    mode={mode}
                    postToEdit={postToEdit}
                    categories={categoriesAndTags?.categories ?? []}
                    tags={categoriesAndTags?.tags ?? []}
                />
                <ForumReportModal
                    onClose={() =>
                        dispatch(forumReportModalAction.closeReportModal())
                    }
                    isOpen={isReportOpen}
                    reportTarget={reportTarget}
                />
            </div>
        </div>
    );
}
