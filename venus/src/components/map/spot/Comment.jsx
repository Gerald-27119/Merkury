import {
  calculateStars,
  formatPublishDate,
} from "../../../utils/spot-utils.jsx";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateComment, deleteComment } from "../../../http/comments.js";
import { useMutation } from "@tanstack/react-query";

export default function Comment({ comment }) {
  const currentUser = localStorage.getItem("username");
  const [updatedText, setUpdatedText] = useState(comment.text);

  const { mutate: handleDelete, isSuccess: deleteSuccess } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      //refetchComments();
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
    },
  });

  const { mutate: handleUpdate, isSuccess: updateSuccess } = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      //refetchComments();
    },
    onError: (error) => {
      console.error("Error updating comment:", error);
    },
  });

  useEffect(() => {
    if (updateSuccess) {
      setUpdatedText(comment.text);
    }
  }, [updateSuccess, comment.text]);

  const onEdit = () => {
    const newText = prompt("Edit your comment:", updatedText);
    if (newText && newText !== updatedText) {
      handleUpdate({ commentId: comment.id, text: newText });
    }
  };

  const onDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      handleDelete({ commentId: comment.id });
    }
  };

  return (
    <div className="border border-stone-400 rounded-sm m-1 p-1">
      <div className="flex mb-1">
        <div className="w-full">
          <p className="text-xs">{formatPublishDate(comment.publishDate)}</p>
          <p className="text-base">{comment.author}</p>
        </div>
        <div className="inline-flex flex-col">
          <div className="inline-flex">{calculateStars(comment.rating)}</div>
          {currentUser === comment.author && (
            <div className="flex space-x-2 mt-1">
              <button
                onClick={() => onEdit(comment)}
                className="text-blue-500 hover:text-blue-700"
                title="Edit Comment"
              >
                <FaEdit size={16} />
              </button>
              <button
                onClick={() => onDelete(comment)}
                className="text-red-500 hover:text-red-700"
                title="Delete Comment"
              >
                <FaTrash size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div>{comment.text}</div>
    </div>
  );
}
