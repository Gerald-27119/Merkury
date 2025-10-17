import ActionIconWithCount from "../posts/components/ActionIconWithCount";
import { MdThumbDown, MdThumbUp } from "react-icons/md";
import { FaReply } from "react-icons/fa";
import ForumCommentGeneral from "../../../model/interface/forum/postComment/forumCommentGeneral";
import ForumCommentMenu from "./ForumCommentMenu";

interface ForumCommentActionsProps {
    comment: ForumCommentGeneral;
    onDelete: (commentId: number) => void;
    onEdit: (comment: ForumCommentGeneral) => void;
    onVote: (commentId: number, isUpvote: boolean) => void;
    onReport: (commentId: number) => void;
    onReply: (commentId: number) => void;
}

export default function ForumCommentActions({
    comment,
    onDelete,
    onEdit,
    onVote,
    onReport,
    onReply,
}: ForumCommentActionsProps) {
    return (
        <div className="mt-2 flex items-center text-2xl">
            <div className="flex gap-6">
                <ActionIconWithCount
                    Icon={MdThumbUp}
                    data={comment.upVotes}
                    isActive={comment.isUpVoted}
                    onClick={() => onVote(comment.id, true)}
                />
                <ActionIconWithCount
                    Icon={MdThumbDown}
                    data={comment.downVotes}
                    isActive={comment.isDownVoted}
                    onClick={() => onVote(comment.id, false)}
                />

                <div className="flex cursor-pointer items-center gap-2 text-lg hover:text-blue-500 dark:hover:text-blue-400">
                    <FaReply onClick={() => onReply(comment.id)} />
                    <p>Reply</p>
                </div>
            </div>
            <div className="ml-8 flex gap-6">
                <FaReply className="cursor-pointer hover:text-blue-500" />
                <ForumCommentMenu
                    comment={comment}
                    isAuthor={comment.isAuthor}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onReport={onReport}
                />
            </div>
        </div>
    );
}
