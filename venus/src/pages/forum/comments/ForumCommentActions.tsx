import ActionIconWithCount from "../posts/components/ActionIconWithCount";
import { MdThumbDown, MdThumbUp } from "react-icons/md";
import { FaReply } from "react-icons/fa";
import ForumContentMenu from "../posts/components/ForumContentMenu";

interface ForumCommentActionsProps {
    commentId: number;
    isAuthor: boolean;
    upVotes: number;
    downVotes: number;
    isUpVoted: boolean;
    isDownVoted: boolean;
    onDelete: (postId: number) => void;
    onEdit: (postId: number) => void;
    onVote: (postId: number, isUpvote: boolean) => void;
    onReport: (postId: number) => void;
}

export default function ForumCommentActions({
    commentId,
    isAuthor,
    upVotes,
    downVotes,
    isUpVoted,
    isDownVoted,
    onDelete,
    onEdit,
    onVote,
    onReport,
}: ForumCommentActionsProps) {
    return (
        <div className="mt-2 flex items-center text-2xl">
            <div className="flex gap-6">
                <ActionIconWithCount
                    Icon={MdThumbUp}
                    data={upVotes}
                    isActive={isUpVoted}
                    onClick={() => onVote(commentId, true)}
                />
                <ActionIconWithCount
                    Icon={MdThumbDown}
                    data={downVotes}
                    isActive={isDownVoted}
                    onClick={() => onVote(commentId, false)}
                />
            </div>
            <div className="ml-8 flex gap-6">
                <FaReply className="cursor-pointer hover:text-blue-500" />
                <ForumContentMenu
                    contentId={commentId}
                    isUserAuthor={isAuthor}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onReport={onReport}
                />
            </div>
        </div>
    );
}
