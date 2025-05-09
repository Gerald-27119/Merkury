import { formatPublishDate } from "../../../../utils/spot-utils.tsx";
import { Rate } from "antd";
import { FaRegThumbsUp, FaRegThumbsDown, FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import EditCommentForm from "./EditCommentForm.jsx";
import { useState } from "react";

export default function Comment({ comment, onEdit, onDelete, onVote }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (editedComment) => {
    onEdit(comment.id, editedComment);
    setIsEditing(false);
  };

  const triggerEdit = () => {
    setIsEditing((prevState) => !prevState);
  };

  const handleDelete = () => {
    onDelete(comment.id);
  };

  const handleVote = (isUpvote) => {
    onVote(comment.id, isUpvote);
  };

  if (isEditing) {
    return (
      <div className="m-1 rounded-md border border-stone-400 p-2">
        <div className="mb-2">
          <EditCommentForm
            comment={comment}
            onSave={handleEdit}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="m-1 rounded-md border border-stone-400 p-2">
      <div className="mb-1 flex justify-between">
        <div>
          <p className="text-xs">{formatPublishDate(comment.publishDate)}</p>
          <p className="text-base font-semibold">{comment.author}</p>
        </div>
        <div className="inline-flex">
          <Rate disabled allowHalf className="text-xs" value={comment.rating} />
        </div>
      </div>

      <div className="mb-2">
        <p>{comment.text}</p>
      </div>

      <div className="flex items-center justify-between text-lg text-gray-600">
        <div className="flex items-center space-x-2">
          <button
            className={`flex items-center hover:text-blue-500 ${comment.isUpvoted ? "text-blue-500" : ""}`}
            onClick={() => handleVote(true)}
          >
            <FaRegThumbsUp />
            <span className="ml-1 text-sm">{comment.upvotes}</span>
          </button>
          <button
            className={`flex items-center hover:text-red-500 ${comment.isDownvoted ? "text-red-500" : ""}`}
            onClick={() => handleVote(false)}
          >
            <FaRegThumbsDown />
            <span className="ml-1 text-sm">{comment.downvotes}</span>
          </button>
        </div>
        {comment.isAuthor && (
          <div className="flex space-x-2">
            <button className="hover:text-yellow-500" onClick={triggerEdit}>
              <FaRegEdit />
            </button>
            <button className="hover:text-red-500" onClick={handleDelete}>
              <FaRegTrashCan />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
