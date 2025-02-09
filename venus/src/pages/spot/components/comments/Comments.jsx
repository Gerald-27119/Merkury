import Comment from "./Comment.jsx";
import Error from "../../../../components/error/Error.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPaginatedComments } from "../../../../http/comments.js";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner.jsx";

export default function Comments({ spotId }) {
  const [currentPage, setCurrentPage] = useState(0);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["spot", "comments", spotId],
    queryFn: () => getPaginatedComments(spotId, currentPage, 2),
    keepPreviousData: true,
    staleTime: 10 * 60 * 1000,
  });

  const handlePageChange = (event) => {
    setCurrentPage(event.selected);
    queryClient.invalidateQueries(["spot", "comments", spotId]);
  };

  return (
    <>
      {error && <Error error={error} />}
      {isLoading && <LoadingSpinner />}
      {data && data.content.length >= 0 ? (
        <div className="border-2 border-neutral-200 px-2.5 py-1 rounded-sm">
          <p className="text-lg">Comments:</p>
          <ul>
            {data.content.map((comment) => (
              <li key={comment.id}>
                <Comment comment={comment} />
              </li>
            ))}
          </ul>
          <ReactPaginate
            pageCount={data.totalPages}
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            initialPage={currentPage}
            marginPagesDisplayed={1}
            pageRangeDisplayed={1}
            onPageChange={handlePageChange}
            containerClassName="flex justify-center items-center space-x-2 mt-3 mb-1"
            pageLinkClassName="px-2 py-1 text-black bg-white border border-gray-300 rounded-md hover:bg-gray-200 hover:text-gray-900"
            activeLinkClassName="!bg-blue-500 !text-white !border-blue-500"
            nextLinkClassName="px-2 py-1 text-black bg-white border border-gray-300 rounded-md hover:bg-gray-200 hover:text-gray-900"
            previousLinkClassName="px-2 py-1 text-black bg-white border border-gray-300 rounded-md hover:bg-gray-200 hover:text-gray-900"
            disabledLinkClassName="opacity-50 cursor-not-allowed"
          />
        </div>
      ) : (
        <span>There are no comments!</span>
      )}
    </>
  );
}
