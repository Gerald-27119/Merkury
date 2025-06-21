import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import SpotCommentVoteDisplay from "./SpotCommentVoteDisplay";

type SpotCommentVotesProps = {
  upvotes: number;
  downvotes: number;
};

export default function SpotCommentVotesPanel({
  upvotes,
  downvotes,
}: SpotCommentVotesProps) {
  return (
    <div className="mt-3 flex w-full justify-start space-x-3">
      <SpotCommentVoteDisplay>
        <BiLike className="cursor-pointer" />
        <p>{upvotes}</p>
      </SpotCommentVoteDisplay>
      <SpotCommentVoteDisplay>
        <BiDislike className="cursor-pointer" />
        <p>{downvotes}</p>
      </SpotCommentVoteDisplay>
    </div>
  );
}
