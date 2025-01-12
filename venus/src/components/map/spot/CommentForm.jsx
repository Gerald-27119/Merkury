import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "../../../http/comments.js";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { notificationAction } from "../../../redux/notification.jsx";

export default function CommentForm({ id }) {
  const spotId = id;
  const [newCommentText, setNewCommentText] = useState("");
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { mutateAsync, isSuccess } = useMutation({
    mutationKey: "addCommentMutation",
    mutationFn: addComment,
    onSuccess: () => {
      setNewCommentText(""); // Reset the input field
      dispatch(
        notificationAction.setSuccess({
          message: "Comment added successfully!",
        }),
      );
      queryClient.invalidateQueries("spots");
    },
    onError: (error) => {
      if (error?.response?.data) {
        dispatch(
          notificationAction.setError({
            message: error.response.data,
          }),
        );
      } else {
        dispatch(
          notificationAction.setError({
            message: "An unexpected error occurred. Please try again.",
          }),
        );
      }
    },
  });
  const handleAddComment = async (event) => {
    event.preventDefault();
    if (newCommentText.trim()) {
      await mutateAsync({
        text: newCommentText,
        spotId: spotId,
      });
    }
  };

  const handleCommentChange = (event) => {
    setNewCommentText(event.target.value);
  };

  useEffect(() => {
    if (isSuccess) {
      setNewCommentText("");
    }
  }, [isSuccess, setNewCommentText]);

  return (
    <>
      <div className="add-comment">
        <div className="flex-grow">
          <textarea
            className="w-full border border-stone-300 rounded-sm p-1"
            value={newCommentText}
            onChange={handleCommentChange}
            placeholder="Type coment here..."
          />
        </div>
        <div className="flex justify-center mt-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>
      </div>
    </>
  );
}
