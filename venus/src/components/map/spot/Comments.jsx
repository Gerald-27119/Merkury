import { useState } from "react";
import ReactPaginate from "react-paginate";
import Comment from "./Comment.jsx";
import { useQuery } from "@tanstack/react-query";
import { getComments } from "../../../http/comments.js";

export default function Comments({ spotId, commentsPerPage = 2 }) {
  const [currentPage, setCurrentPage] = useState(0);

  const { data, error } = useQuery({
    queryFn: () => getComments(spotId, currentPage, commentsPerPage),
    queryKey: ["comments", spotId, currentPage, commentsPerPage],
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <>
      {data && data?.content.length >= 0 ? (
        <div className="border-2 border-neutral-200 px-2.5 py-1 rounded-sm">
          <p className="text-lg">Comments:</p>
          <ul>
            {data.content.map((comment) => (
              <li key={comment.id}>
                <Comment comment={comment} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <span>There are no comments!</span>
      )}
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        previousLabel="<"
        initialPage={0}
        pageRangeDisplayed={1}
        marginPagesDisplayed={1}
        onPageChange={handlePageClick}
        pageCount={data?.totalPages || 0}
        containerClassName="flex justify-center space-x-2 mt-1 text-sm"
        pageClassName="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded cursor-pointer"
        activeClassName="bg-blue-300 text-black"
        previousClassName="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded cursor-pointer"
        nextClassName="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded cursor-pointer"
        disabledClassName="opacity-50 cursor-not-allowed"
      />
    </>
  );
}
