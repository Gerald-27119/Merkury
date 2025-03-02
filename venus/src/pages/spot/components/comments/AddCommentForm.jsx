import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "../../../../http/comments.js";
import { Rate } from "antd";
import { notificationAction } from "../../../../redux/notification.jsx";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AddCommentForm({ spotId, isUserLoggedIn }) {
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5.0);
  const [revealed, setRevealed] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resetForm = () => {
    setCommentText("");
    setRating(5.0);
    setRevealed(false);
  };

  const handleCommentChange = (text) => {
    setCommentText(text);
  };

  const handleFocus = () => {
    setRevealed(true);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const { mutateAsync: mutate } = useMutation({
    mutationFn: addComment,
    onSuccess: async () => {
      resetForm();
      await queryClient.invalidateQueries(["spot", "comments", spotId]);
      dispatch(
        notificationAction.setSuccess({
          message: "Comment added successfully!",
        }),
      );
    },
    onError: (error) => {
      if (error.response && error.response.status === 401) {
        dispatch(
          notificationAction.setError({
            message: "Log in in order to comment.",
          }),
        );
      } else {
        dispatch(
          notificationAction.setError({
            message: "Failed to add comment. Please try again later.",
          }),
        );
      }
    },
  });

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      dispatch(
        notificationAction.setError({
          message: "Comment can't be empty!",
        }),
      );
      return;
    }
    let newComment = { text: commentText, rating: rating };
    await mutate({ spotId, newComment });
  };

  return (
    <div className="p-2 mt-4 mb-8 rounded-lg bg-gray-100">
      <div>
        {revealed && <Rate allowHalf value={rating} onChange={setRating} />}
      </div>
      <textarea
        className="w-full p-2 border rounded resize-none"
        rows="2"
        placeholder={
          isUserLoggedIn ? "Write your opinion" : "Log in to comment"
        }
        maxLength="300"
        value={commentText}
        onChange={(e) => handleCommentChange(e.target.value)}
        onFocus={handleFocus}
      />

      {revealed && (
        <div className="flex justify-end space-x-2 mt-2">
          <button
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={resetForm}
          >
            Cancel
          </button>

          {!isUserLoggedIn && (
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleLogin}
            >
              Log In
            </button>
          )}

          {isUserLoggedIn && (
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleAddComment}
            >
              Comment
            </button>
          )}
        </div>
      )}
    </div>
  );
}
