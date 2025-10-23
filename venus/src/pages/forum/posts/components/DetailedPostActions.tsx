import { MdThumbDown, MdThumbUp } from "react-icons/md";
import { FaComment, FaShare } from "react-icons/fa";
import PostMenu from "./PostMenu";
import AddCommentButton from "../../components/AddCommentButton";
import DetailedPostActionButton from "./DetailedPostActionButton";

interface DetailedPostActionsProps {
    postId: number;
    isAuthor: boolean;
    upVotes: number;
    downVotes: number;
    isUpVoted: boolean;
    isDownVoted: boolean;
    numberOfComments: number;
    onDelete: (postId: number) => void;
    onEdit: (postId: number) => void;
    onVote: (postId: number, isUpvote: boolean) => void;
    onFollow: (postId: number) => void;
    onReport: (postId: number) => void;
}

export default function DetailedPostActions({
    postId,
    isAuthor,
    upVotes,
    downVotes,
    isUpVoted,
    isDownVoted,
    numberOfComments,
    onDelete,
    onEdit,
    onVote,
    onFollow,
    onReport,
}: DetailedPostActionsProps) {
    return (
        <div className="mt-2 flex items-center text-2xl">
            <div className="flex gap-6">
                <DetailedPostActionButton
                    Icon={MdThumbUp}
                    data={upVotes}
                    isActive={isUpVoted}
                    onClick={() => onVote(postId, true)}
                />
                <DetailedPostActionButton
                    Icon={MdThumbDown}
                    data={downVotes}
                    isActive={isDownVoted}
                    onClick={() => onVote(postId, false)}
                />
                <DetailedPostActionButton
                    Icon={FaComment}
                    data={numberOfComments}
                />
            </div>

            <div className="ml-8 flex gap-6">
                <FaShare className="cursor-pointer hover:text-blue-500" />
                <PostMenu
                    postId={postId}
                    isUserAuthor={isAuthor}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onFollow={onFollow}
                    onReport={onReport}
                />
            </div>

            <AddCommentButton />
        </div>
    );
}
