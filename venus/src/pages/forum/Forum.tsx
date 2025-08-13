import { useQuery } from "@tanstack/react-query";
import Error from "../../components/error/Error.jsx";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner.jsx";
import { fetchPaginatedPosts, fetchCategoriesAndTags } from "../../http/posts";
import { useState } from "react";
import Post from "./posts/Post";
import AddPostButton from "./components/AddPostButton";
import ForumSearchBar from "./components/ForumSearchBar";
import ForumCategoriesTagsPanel from "./categories-and-tags/ForumCategoriesTagsPanel";
import RightPanel from "./components/RightPanel";
import ForumFormModal from "./components/ForumFormModal";
import { useBoolean } from "../../hooks/useBoolean";

export default function Forum() {
    const [currentPage, setCurrentPage] = useState(0);
    const [isModalOpen, setIsModalOpenToTrue, setIsModalOpenToFalse] =
        useBoolean(false);

    const {
        data: posts,
        error: postError,
        isError: isPostError,
        isLoading: isPostLoading,
    } = useQuery({
        queryKey: ["posts", currentPage],
        queryFn: () => fetchPaginatedPosts(currentPage),
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

    if (isPostLoading) {
        return (
            <div>
                <LoadingSpinner />
            </div>
        );
    }

    if (isPostError) {
        return <Error error={postError} />;
    }

    return (
        <>
            <div className="dark:bg-darkBg dark:text-darkText text-lightText bg-lightBg min-h-screen w-full">
                <div className="mx-auto mt-8 flex w-full max-w-6xl flex-row gap-4">
                    <div>
                        <AddPostButton onClick={setIsModalOpenToTrue} />
                        <ForumCategoriesTagsPanel
                            data={categoriesAndTags}
                            isLoading={isCatTagsLoading}
                            isError={isCatTagsError}
                            error={catTagsError}
                        />
                    </div>

                    {posts?.content?.length ? (
                        <div className="mt-10">
                            <ul>
                                {posts.content.map((post) => (
                                    <li key={post.id}>
                                        <Post post={post} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <span>No posts available</span>
                    )}

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
