import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "../../../../http/comments.js";
import { Rate } from "antd";
import { notificationAction } from "../../../../redux/notification.jsx";
import { useDispatch } from "react-redux";

export default function AddCommentForm({ spotId }) {
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5.0);
  const [revealed, setRevealed] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const resetForm = () => {
    setNewComment("");
    setRating(5.0);
    setRevealed(false);
  };

  const { mutateAsync: mutate } = useMutation({
    mutationFn: (comment) => addComment(comment, rating, spotId),
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries(["spot", "comments", spotId]);
      dispatch(
        notificationAction.setSuccess({
          message: "Comment added successfully!",
        }),
      );
    },
    onError: () => {
      dispatch(
        notificationAction.setError({
          message: "Failed to add comment. Please try again later.",
        }),
      );
    },
  });

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      dispatch(
        notificationAction.setError({
          message: "Comment can't be empty!",
        }),
      );
      return;
    }
    await mutate({
      text: newComment,
      rating,
      spotId,
    });
  };

  return (
    <div>
      <div>
        <Rate allowHalf value={rating} onChange={setRating} />
      </div>
      <textarea
        className="w-full p-2 border rounded resize-none"
        rows="3"
        placeholder="Write your opinion"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        onFocus={() => setRevealed(true)}
      />
      <div className="flex justify-end space-x-2 mt-2">
        {revealed && (
          <div>
            <button
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              onClick={resetForm}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleAddComment}
            >
              Comment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
