import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";

type SpotCommentVotesProps = {
  upvotes: number;
  downvotes: number;
};

export default function SpotCommentVotes({
  upvotes,
  downvotes,
}: SpotCommentVotesProps) {
  return (
    <div>
      <div>
        <BiLike />
        {upvotes}
      </div>
      <div>
        <BiDislike />
        {downvotes}
      </div>
    </div>
  );
}
