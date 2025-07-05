import { BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import SpotCommentVoteDisplay from "./SpotCommentVoteDisplay";

type SpotCommentVotesProps = {
    upvotes: number;
    downvotes: number;
};

const inActiveBtnClassNames: string =
    "absolute cursor-pointer transition-opacity hover:opacity-0";
const activeBtnClassNames: string =
    "absolute cursor-pointer opacity-0 transition-opacity hover:opacity-100";

export default function SpotCommentVotesPanel({
    upvotes,
    downvotes,
}: SpotCommentVotesProps) {
    return (
        <div className="mt-3 flex w-full justify-start space-x-3">
            <SpotCommentVoteDisplay votes={upvotes}>
                <BiLike className={inActiveBtnClassNames} />
                <BiSolidLike className={activeBtnClassNames} />
            </SpotCommentVoteDisplay>
            <SpotCommentVoteDisplay votes={downvotes}>
                <BiDislike className={inActiveBtnClassNames} />
                <BiSolidDislike className={activeBtnClassNames} />
            </SpotCommentVoteDisplay>
        </div>
    );
}
