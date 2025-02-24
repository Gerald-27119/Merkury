import Comment from "./Comment.jsx";
import Error from "../../../../components/error/Error.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPaginatedComments,
  deleteComment,
  editComment,
  voteComment,
} from "../../../../http/comments.js";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner.jsx";
import AddCommentForm from "./AddCommentForm.jsx";
import { notificationAction } from "../../../../redux/notification.jsx";
import { useDispatch } from "react-redux";

export default function Comments({ spotId }) {
  const [currentPage, setCurrentPage] = useState(0);

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { data, isLoading, error } = useQuery({
    queryKey: ["spot", "comments", spotId],
    queryFn: () => getPaginatedComments(spotId, currentPage),
    keepPreviousData: true,
    staleTime: 10 * 60 * 1000,
  });

  const { mutateAsync: mutateVote } = useMutation({
    mutationFn: voteComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["spot", "comments", spotId]);
    },
    onError: (error) => {
      if (error.response && error.response.status === 401) {
        dispatch(
          notificationAction.setError({
            message: "Log in in order to vote.",
          }),
        );
      } else {
        dispatch(
          notificationAction.setError({
            message: "An error has occured. Please try again later.",
          }),
        );
      }
    },
  });

  const { mutateAsync: mutateEdit } = useMutation({
    mutationFn: editComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["spot", "comments", spotId]);
      dispatch(
        notificationAction.setSuccess({
          message: "Comment edited successfully!",
        }),
      );
    },
    onError: () => {
      dispatch(
        notificationAction.setError({
          message: "Failed to edit comment. Please try again later.",
        }),
      );
    },
  });

  const { mutateAsync: mutateDelete } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["spot", "comments", spotId]);
      dispatch(
        notificationAction.setSuccess({
          message: "Comment deleted successfully!",
        }),
      );
    },
    onError: () => {
      const errorMessage =
        error.response && error.response.status === 401
          ? "Log in in order to vote."
          : "An error has occured. Please try again later.";

      dispatch(
        notificationAction.setError({
          message: errorMessage,
        }),
      );
    },
  });

  const handlePageChange = (event) => {
    setCurrentPage(event.selected);
    queryClient.invalidateQueries(["spot", "comments", spotId]);
  };

  const handleVote = async (commentId, isUpvote) => {
    await mutateVote({ commentId, isUpvote });
  };

  const handleEdit = async (commentId, editedComment) => {
    await mutateEdit({ commentId, editedComment });
  };

  const handleDelete = async (commentId) => {
    await mutateDelete(commentId);
  };

  return (
    <>
      {error && <Error error={error} />}
      {isLoading && <LoadingSpinner />}

      <AddCommentForm spotId={spotId} />

      <p className="text-lg">Comments:</p>
      {data && data.content.length >= 0 ? (
        <div className="border-2 border-neutral-200 px-2.5 py-1 rounded-sm">
          <ul>
            {data.content.map((comment) => (
              <li key={comment.id}>
                <Comment
                  comment={comment}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onVote={handleVote}
                />
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
