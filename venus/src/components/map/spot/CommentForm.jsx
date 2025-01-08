import { useMutation } from "@tanstack/react-query";
import { addComment } from "../../../http/comments.js";
import { useEffect, useState } from "react";

export default function CommentForm({ id }) {
  const spotId = id;
  const [newCommentText, setNewCommentText] = useState("");

  const { mutate, isSuccess, error } = useMutation({
    mutationFn: addComment,
  });
  const handleAddComment = async (event) => {
    event.preventDefault();
    if (newCommentText.trim()) {
      mutate({
        text: newCommentText,
        spotId: spotId,
      });
    }
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
            onChange={(e) => setNewCommentText(e.target.value)}
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
        {error && (
          <p className="text-red-500 mt-2">
            Error adding comment. Please try again.
          </p>
        )}
      </div>
    </>
  );
}
