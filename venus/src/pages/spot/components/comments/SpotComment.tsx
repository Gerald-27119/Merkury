import { formatPublishDate } from "../../../../utils/spot-utils";
import { Rate } from "antd";
import { FaRegThumbsUp, FaRegThumbsDown, FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import EditCommentForm from "./EditCommentForm.jsx";
import { useState } from "react";
import SpotCommentDto from "../../../../model/interface/spot/comment/spotCommentDto";
import { FaPlus } from "react-icons/fa6";
import Button from "../../../../components/buttons/Button";
import SpotCommentAuthor from "./SpotCommentAuthor";
import SpotCommentHeader from "./SpotCommentHeader";
import SpotCommentVotesPanel from "./SpotCommentVotesPanel";
import SpotCommentPhotos from "./SpotCommentPhotos";

type SpotCommentProps = {
  comment: SpotCommentDto;
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
    <div className="bg-second flex flex-col items-center rounded-2xl px-4 py-2">
      <div className="my-3 flex w-full flex-col items-start">
        <SpotCommentAuthor author={comment.author} />
        <div className="flex items-baseline">
          <div className="custom-rate-spot-comment text-ratingStarColor mt-2 mr-3.5 inline-flex min-w-fit">
            <Rate
              data-testid="spot-rating"
              disabled
              allowHalf
              value={comment.rating}
            />
          </div>
          <p className="text-lg">{formatPublishDate(comment.publishDate)}</p>
        </div>
      </div>
      <p className="mb-3 w-full text-left">{comment.text}</p>
      {comment.photoList && <SpotCommentPhotos photos={comment.photoList} />}
      <SpotCommentVotesPanel
        upvotes={comment.upvotes}
        downvotes={comment.downvotes}
      />
    </div>
  );
}
