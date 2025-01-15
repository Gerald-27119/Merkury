import {
  calculateStars,
  formatPublishDate,
} from "../../../utils/spot-utils.jsx";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { updateComment, deleteComment } from "../../../http/comments.js";
import { useMutation } from "@tanstack/react-query";

export default function Comment({ comment }) {
  const currentUser = localStorage.getItem("username");
  const [updatedText, setUpdatedText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutate: handleDelete, isSuccess: deleteSuccess } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      setIsDeleting(false);
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
    },
  });

  const { mutate: handleUpdate, isSuccess: updateSuccess } = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Error updating comment:", error);
    },
  });

  const saveEdit = () => {
    if (updatedText !== comment.text) {
      handleUpdate({ commentId: comment.id, text: updatedText });
    }
    setIsEditing(false);
  };

  const confirmDelete = () => {
    handleDelete({ commentId: comment.id });
  };

  return (
    <div className="border border-stone-400 rounded-sm m-1 p-1">
      <div className="flex mb-1">
        <div className="w-full">
          <p className="text-xs">{formatPublishDate(comment.publishDate)}</p>
          <p className="text-base">{comment.author}</p>
        </div>
          <div className="inline-flex">{calculateStars(comment.rating)}</div>
      </div>
      <div>
        <p>{comment.text}</p>
      </div>
    </div>
  );
}
