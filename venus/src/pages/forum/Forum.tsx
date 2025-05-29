import { useQuery } from "@tanstack/react-query";
import Error from "../../components/error/Error.jsx";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner.jsx";
import { fetchPaginatedPosts } from "../../http/posts";
import { useState } from "react";
import Post from "./components/Post";
import AddPostButton from "./components/AddPostButton";
import PostSearchBar from "./components/PostSearchBar";
import CategoriesTagsPanel from "./components/CategoriesTagsPanel";
import RightPanel from "./components/RightPanel";
import ForumFormModal from "./components/ForumFormModal";
import { useBoolean } from "../../hooks/useBoolean";

export default function Forum() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpenToTrue, setIsModalOpenToFalse] =
    useBoolean(false);

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPaginatedPosts(currentPage),
  });

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <Error error={error} />;
  }

  return (
    <>
      <div className="dark:bg-darkBg dark:text-darkText text-lightText bg-lightBg min-h-screen w-full">
        <div className="mx-auto mt-8 flex w-full max-w-6xl flex-row gap-4">
          <div>
            <AddPostButton onClick={setIsModalOpenToTrue} />
            <CategoriesTagsPanel />
          </div>

          {data?.content?.length ? (
            <div className="mt-10">
              <ul>
                {data.content.map((post) => (
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
            <PostSearchBar />
            <RightPanel />
          </div>
          <ForumFormModal
            onClose={setIsModalOpenToFalse}
            isOpen={isModalOpen}
          />
        </div>
      </div>
    </>
  );
}
