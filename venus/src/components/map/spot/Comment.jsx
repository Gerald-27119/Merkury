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
        <div className="inline-flex flex-col">
          <div className="inline-flex">{calculateStars(comment.rating)}</div>
          {currentUser === comment.author && (
            <div className="flex space-x-2 mt-1">
              {isDeleting ? (
                <>
                  <button
                    onClick={confirmDelete}
                    className="text-red-500 hover:text-red-700"
                    title="Confirm Delete"
                  >
                    <FaCheck size={16} />
                  </button>
                  <button
                    onClick={() => setIsDeleting(false)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Cancel Delete"
                  >
                    <FaTimes size={16} />
                  </button>
                </>
              ) : isEditing ? (
                <>
                  <button
                    onClick={saveEdit}
                    className="text-green-500 hover:text-green-700"
                    title="Confirm Edit"
                  >
                    <FaCheck size={16} />
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Cancel Edit"
                  >
                    <FaTimes size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit Comment"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => setIsDeleting(true)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Comment"
                  >
                    <FaTrash size={16} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div>
        {isEditing ? (
          <textarea
            className="w-full border border-stone-300 rounded-sm p-1"
            value={updatedText}
            onChange={(e) => setUpdatedText(e.target.value)}
          />
        ) : (
          <p>{comment.text}</p>
        )}
      </div>
      {isDeleting && (
        <div className="mt-2 flex items-center space-x-2">
          <p className="text-red-600">
            Are you sure you want to delete this comment?
          </p>
        </div>
      )}
    </div>
  );
}
