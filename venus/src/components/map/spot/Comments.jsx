import { useState } from "react";
import ReactPaginate from "react-paginate";
import Comment from "./Comment.jsx";

export default function Comments({ comments, commentsPerPage = 2 }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [commentsState, setCommentsState] = useState(comments);

  const pageCount = Math.ceil(comments.length / commentsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const offset = currentPage * commentsPerPage;
  const currentComments = commentsState.slice(offset, offset + commentsPerPage);

  return (
    <>
      {commentsState && commentsState.length >= 0 ? (
        <div className="border-2 border-neutral-200 px-2.5 py-1 rounded-sm">
          <p className="text-lg">Comments:</p>
          <ul>
            {currentComments.map((comment) => (
              <li key={comment.id}>
                <Comment
                  comment={comment}
                  //onEdit={handleEditComment()}
                  //onDelete={handleDeleteComment()}
                />
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
        pageCount={pageCount}
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
