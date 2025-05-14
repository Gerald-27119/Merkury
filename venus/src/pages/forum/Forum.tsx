import { useQuery } from "@tanstack/react-query";
import Error from "../../components/error/Error.jsx";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner.jsx";
import { fetchPaginatedPosts } from "../../http/posts";
import { useState } from "react";
import Post from "./components/Post";

export default function Forum() {
  const [currentPage, setCurrentPage] = useState(0);

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPaginatedPosts(currentPage),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <Error error={error} />;
  }

  return (
    <>
      <div className="dark:bg-darkBg dark:text-darkText text-lightText bg-lightBg min-h-screen w-full">
        {data && data.content.length > 0 ? (
          <div>
            <ul>
              {data.content.map((post) => (
                <li key={post.id}>
                  <Post post={post} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <span>No posts</span>
        )}
      </div>
    </>
  );
}
