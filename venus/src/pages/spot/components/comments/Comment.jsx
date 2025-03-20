import { formatPublishDate } from "../../../../utils/spot-utils.jsx";
import { ConfigProvider, Rate } from "antd";
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
      <div className="bg-darkBgMuted rounded-md m-1 p-2">
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
    <div className="bg-darkBgMuted rounded-md p-2">
      <div className="flex mb-1 justify-between">
        <div>
          <p className="text-xs">{formatPublishDate(comment.publishDate)}</p>
          <p className="text-base font-semibold">{comment.author}</p>
        </div>
        <div className="inline-flex">
          <ConfigProvider
            theme={{
              components: {
                Rate: {
                  starBg: "#939394",
                },
              },
            }}
          >
            <Rate
              disabled
              allowHalf
              className="text-xs"
              value={comment.rating}
            />
          </ConfigProvider>
        </div>
      </div>

      <div className="mb-2">
        <p>{comment.text}</p>
      </div>

      <div className="flex justify-between items-center text-gray-600 text-lg">
        <div className="flex items-center space-x-2">
          <button
            className={`hover:text-mainBlue flex items-center ${comment.isUpvoted ? "text-mainBlue" : "text-darkBorder"}`}
            onClick={() => handleVote(true)}
          >
            <FaRegThumbsUp />
            <span className="text-sm ml-1">{comment.upvotes}</span>
          </button>
          <button
            className={`hover:text-red-500 flex items-center ${comment.isDownvoted ? "text-red-500" : "text-darkBorder"}`}
            onClick={() => handleVote(false)}
          >
            <FaRegThumbsDown />
            <span className="text-sm ml-1">{comment.downvotes}</span>
          </button>
        </div>
        {comment.isAuthor && (
          <div className="flex space-x-2">
            <button
              className="hover:text-yellow-500 text-darkBorder"
              onClick={triggerEdit}
            >
              <FaRegEdit />
            </button>
            <button
              className="hover:text-red-500 text-darkBorder"
              onClick={handleDelete}
            >
              <FaRegTrashCan />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
