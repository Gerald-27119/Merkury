import { formatPublishDate } from "../../../../utils/spot-utils";
import { Rate } from "antd";
import { FaRegThumbsUp, FaRegThumbsDown, FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import EditCommentForm from "./EditCommentForm.jsx";
import { useState } from "react";
import SpotComment from "../../../../model/interface/spot/comment/spotComment";
import { FaPlus } from "react-icons/fa6";
import Button from "../../../../components/buttons/Button";
import SpotCommentAuthor from "./SpotCommentAuthor";
import SpotCommentHeader from "./SpotCommentHeader";
import SpotCommentVotes from "./SpotCommentVotes";

type SpotCommentProps = {
  comment: SpotComment;
};

export default function SpotComment({ comment }: SpotCommentProps) {
  const [isEditing, setIsEditing] = useState(false);

  // const handleEdit = (editedComment) => {
  //   onEdit(comment.id, editedComment);
  //   setIsEditing(false);
  // };
  //
  // const triggerEdit = () => {
  //   setIsEditing((prevState) => !prevState);
  // };
  //
  // const handleDelete = () => {
  //   onDelete(comment.id);
  // };
  //
  // const handleVote = (isUpvote) => {
  //   onVote(comment.id, isUpvote);
  // };

  // if (isEditing) {
  //   return (
  //     <div className="m-1 rounded-md border border-stone-400 p-2">
  //       <div className="mb-2">
  //         <EditCommentForm
  //           comment={comment}
  //           onSave={handleEdit}
  //           onCancel={() => setIsEditing(false)}
  //         />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <SpotCommentHeader />
      <div>
        <SpotCommentAuthor author={comment.author} />
        <p>{comment.publishDate}</p>
      </div>
      <p>{comment.text}</p>
      <SpotCommentVotes
        upvotes={comment.upVotes}
        downvotes={comment.downVotes}
      />
    </div>
  );
}
