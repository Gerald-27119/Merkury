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
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner.jsx";
import { notificationAction } from "../../../../redux/notification.jsx";
import { useDispatch } from "react-redux";

export default function Comments({ spotId, isUserLoggedIn }) {
  const [currentPage, setCurrentPage] = useState(0);

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { data, isLoading, error } = useQuery({
    queryFn: () => getPaginatedComments(spotId, currentPage),
    queryKey: ["spot", "comments", spotId, currentPage],
    keepPreviousData: true,
    staleTime: 10 * 60 * 1000,
  });

  const { mutateAsync: mutateVote } = useMutation({
    mutationFn: voteComment,
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        "spot",
        "comments",
        spotId,
        currentPage,
      ]);
    },
    onError: (error) => {
      const errorMessage =
        error.response && error.response.status === 401
          ? "Log in in order to vote."
          : undefined;

      dispatch(
        notificationAction.setError({
          message: errorMessage,
        }),
      );
    },
  });

  const { mutateAsync: mutateEdit } = useMutation({
    mutationFn: editComment,
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        "spot",
        "comments",
        spotId,
        currentPage,
      ]);
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
    onSuccess: async () => {
      await queryClient.invalidateQueries(["spot", "comments", spotId]);
      dispatch(
        notificationAction.setSuccess({
          message: "Comment deleted successfully!",
        }),
      );
    },
    onError: () => {
      dispatch(
        notificationAction.setError({
          message: "Failed to delete comment. Please try again later.",
        }),
      );
    },
  });

  const handlePageChange = (event) => {
    setCurrentPage(event.selected);
  };

  const handlePageAfterRemove = () => {
    if (data && data.content.length === 1 && currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleVote = async (commentId, isUpvote) => {
    try {
      await mutateVote({ commentId, isUpvote });
    } catch (error) {}
  };

  const handleEdit = async (commentId, editedComment) => {
    await mutateEdit({ commentId, editedComment });
  };

  const handleDelete = async (commentId) => {
    await mutateDelete(commentId);
    handlePageAfterRemove();
  };

  useEffect(() => {
    const invalidate = async () => {
      await queryClient.invalidateQueries(["spot", "comments", spotId]);
    };
    invalidate();
  }, [isUserLoggedIn]);

  return (
    <>
      {error && <Error error={error} />}
      {isLoading && <LoadingSpinner />}

      <p className="text-lg w-fit">Comments:</p>
      {data && data.content.length >= 0 ? (
        <div className="px-2.5 py-1 rounded-sm flex flex-col items-center">
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
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={data.totalPages}
            forcePage={currentPage}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
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
        <span>Be the first one to comment!</span>
      )}
    </>
  );
}
